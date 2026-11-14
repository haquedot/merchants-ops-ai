"""Paytm webhook processing.

    POST /api/v1/webhooks/paytm -> route -> THIS SERVICE

Order of operations:
1. verify the ``x-paytm-signature`` HMAC against ``PAYTM_WEBHOOK_SECRET``
   using the RAW body;
2. parse the envelope;
3. idempotency check against ``processed_webhook_events``;
4. correlate the payment_link entity to our Intervention / RecoveryEvent;
5. apply the authoritative state change:
   * ``payment_link.paid`` -> create the Outcome (payment_recovered = true),
     close event, mark payment recovered;
   * other events -> record ``last_paytm_status``;
6. record the processed event id for idempotency.
"""
from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.integrations.paytm import PaytmConfig, WebhookEnvelope, verify_signature
from app.integrations.paytm.exceptions import WebhookSignatureError
from app.models.agent_events import AgentEvent
from app.models.audit_log import AuditLog
from app.models.interventions import Intervention
from app.models.outcome import Outcome
from app.models.payment import Payment
from app.models.recovery_events import RecoveryEvent
from app.models.subscription import Subscription
from app.models.webhook_event import ProcessedWebhookEvent

WEBHOOK_ACTOR = "paytm_webhook"

_HANDLED_EVENTS = {
    "payment_link.paid",
    "payment_link.partially_paid",
    "payment_link.cancelled",
    "payment_link.expired",
}


@dataclass
class WebhookProcessResult:
    http_status: int
    status: str
    event: str | None = None
    recovery_event_id: int | None = None
    intervention_id: int | None = None
    payment_recovered: bool = False
    recovered_amount_paise: int | None = None

    def body(self) -> dict[str, Any]:
        out: dict[str, Any] = {"status": self.status}
        if self.event:
            out["event"] = self.event
        if self.recovery_event_id is not None:
            out["recovery_event_id"] = self.recovery_event_id
        if self.payment_recovered:
            out["payment_recovered"] = True
        return out


class PaytmWebhookService:
    def __init__(self, db: Session, config: PaytmConfig | None = None) -> None:
        self.db = db
        self.config = config or PaytmConfig.from_settings()

    def process(
        self, *, raw_body: bytes, signature: str | None, event_id: str | None
    ) -> WebhookProcessResult:
        secret = self.config.webhook_secret
        if not secret:
            from app.integrations.paytm.exceptions import PaytmConfigError
            raise PaytmConfigError("PAYTM_WEBHOOK_SECRET is not configured.")

        try:
            verify_signature(raw_body, signature, secret)
        except WebhookSignatureError:
            return WebhookProcessResult(http_status=400, status="invalid_signature")

        try:
            parsed = json.loads(raw_body.decode("utf-8"))
            envelope = WebhookEnvelope(
                event=parsed.get("event", "payment_link.paid"),
                event_id=parsed.get("event_id") or event_id,
                created_at=parsed.get("created_at"),
                payload=parsed.get("payload", parsed),
                raw=parsed,
            )
        except Exception:
            return WebhookProcessResult(http_status=400, status="bad_payload")

        key = event_id or envelope.event_id or self._synthetic_id(raw_body)

        if self.db.get(ProcessedWebhookEvent, key) is not None:
            return WebhookProcessResult(
                http_status=200, status="already_processed", event=envelope.event
            )

        if envelope.event not in _HANDLED_EVENTS:
            return WebhookProcessResult(
                http_status=200, status="ignored", event=envelope.event
            )

        try:
            result = self._dispatch(envelope)
            if result.status != "correlation_failed":
                self._record(key, envelope.event, result)
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            return WebhookProcessResult(
                http_status=200, status="already_processed", event=envelope.event
            )
        except Exception:
            self.db.rollback()
            raise
        return result

    def _dispatch(self, envelope: WebhookEnvelope) -> WebhookProcessResult:
        pl = envelope.payload.get("payment_link", {}).get("entity", envelope.payload)
        intervention = self._correlate(pl)
        if intervention is None:
            return WebhookProcessResult(
                http_status=200, status="correlation_failed", event=envelope.event
            )

        if envelope.event == "payment_link.paid":
            return self._handle_paid(envelope, intervention)
        return self._handle_non_terminal(envelope, intervention, pl)

    def _correlate(self, pl_entity: dict) -> Intervention | None:
        link_id = pl_entity.get("id")
        ref = pl_entity.get("reference_id")

        stmt_opts = (
            selectinload(Intervention.outcome),
            selectinload(Intervention.recovery_event)
            .selectinload(RecoveryEvent.payment)
            .selectinload(Payment.subscription)
            .selectinload(Subscription.customer),
        )
        if link_id:
            iv = self.db.scalars(
                select(Intervention)
                .where(Intervention.paytm_payment_link_id == link_id)
                .options(*stmt_opts)
            ).one_or_none()
            if iv is not None:
                return iv
        if ref and ref.startswith("recovery-"):
            parts = ref.split("-")
            if len(parts) == 3 and parts[2].isdigit():
                iv = self.db.scalars(
                    select(Intervention)
                    .where(Intervention.id == int(parts[2]))
                    .options(*stmt_opts)
                ).one_or_none()
                if iv is not None and iv.recovery_event_id == int(parts[1]):
                    return iv
        return None

    def _handle_paid(
        self, envelope: WebhookEnvelope, intervention: Intervention
    ) -> WebhookProcessResult:
        event = intervention.recovery_event
        payment = event.payment
        now = datetime.now(timezone.utc)

        pay_entity = envelope.payload.get("payment", {}).get("entity", envelope.payload)
        pl_entity = envelope.payload.get("payment_link", {}).get("entity", envelope.payload)
        amount = int(
            pay_entity.get("amount")
            or pl_entity.get("amount_paid")
            or payment.amount
        )
        paytm_payment_id = pay_entity.get("id", f"ptm_pay_{intervention.id}")

        if intervention.outcome is not None:
            return WebhookProcessResult(
                http_status=200, status="already_processed", event=envelope.event,
                recovery_event_id=event.id, intervention_id=intervention.id,
                payment_recovered=intervention.outcome.payment_recovered,
                recovered_amount_paise=intervention.outcome.recovered_amount_paise,
            )

        self.db.add(
            Outcome(
                intervention_id=intervention.id,
                payment_recovered=True,
                recovered_amount_paise=amount,
                recovery_time_seconds=self._recovery_seconds(intervention, now),
                observed_at=now,
            )
        )
        intervention.paytm_payment_id = paytm_payment_id
        intervention.last_paytm_status = "paid"
        if intervention.status != "executed":
            intervention.status = "executed"
        if intervention.executed_at is None:
            intervention.executed_at = now

        if payment.status != "success":
            payment.status = "success"
        if payment.recovered_at is None:
            payment.recovered_at = now

        if event.status == "open":
            event.status = "closed"
            event.closed_at = now

        self.db.add(
            AuditLog(
                recovery_event_id=event.id,
                actor=WEBHOOK_ACTOR,
                action="recovery_confirmed_paytm_payment_link_paid",
                reason=(
                    f"verified payment_link.paid: {amount} paise recovered via "
                    f"{intervention.action_type}"
                )[:500],
                event_metadata={
                    "intervention_id": intervention.id,
                    "paytm_payment_link_id": intervention.paytm_payment_link_id,
                    "paytm_payment_id": paytm_payment_id,
                    "recovered_amount_paise": amount,
                },
            )
        )
        self.db.add(
            AgentEvent(
                recovery_event_id=event.id,
                event_type="paytm_webhook_recovery",
                input_context={
                    "source": "paytm_webhook",
                    "event": envelope.event,
                    "action_type": intervention.action_type,
                    "intervention_id": intervention.id,
                    "recovered_amount_paise": amount,
                    "paytm_payment_link_id": intervention.paytm_payment_link_id,
                    "paytm_payment_id": paytm_payment_id,
                },
            )
        )

        return WebhookProcessResult(
            http_status=200,
            status="ok",
            event=envelope.event,
            recovery_event_id=event.id,
            intervention_id=intervention.id,
            payment_recovered=True,
            recovered_amount_paise=amount,
        )

    def _handle_non_terminal(
        self, envelope: WebhookEnvelope, intervention: Intervention, pl_entity: dict
    ) -> WebhookProcessResult:
        new_status = pl_entity.get("status") or envelope.event.split(".", 1)[-1]
        intervention.last_paytm_status = new_status
        self.db.add(
            AuditLog(
                recovery_event_id=intervention.recovery_event_id,
                actor=WEBHOOK_ACTOR,
                action=f"paytm_{envelope.event.replace('.', '_')}",
                reason=f"paytm webhook status update: {new_status}"[:500],
                event_metadata={
                    "intervention_id": intervention.id,
                    "paytm_payment_link_id": intervention.paytm_payment_link_id,
                    "paytm_status": new_status,
                },
            )
        )
        return WebhookProcessResult(
            http_status=200,
            status="ok",
            event=envelope.event,
            recovery_event_id=intervention.recovery_event_id,
            intervention_id=intervention.id,
            payment_recovered=False,
        )

    @staticmethod
    def _synthetic_id(raw_body: bytes) -> str:
        return f"syn_{hashlib.sha256(raw_body).hexdigest()[:32]}"

    @staticmethod
    def _recovery_seconds(intervention: Intervention, now: datetime) -> int | None:
        start = intervention.executed_at
        if start is None:
            return None
        return max(0, int((now - start).total_seconds()))

    def _record(self, event_id: str, event_type: str, result: WebhookProcessResult) -> None:
        self.db.add(
            ProcessedWebhookEvent(
                event_id=event_id,
                event_type=event_type,
                recovery_event_id=result.recovery_event_id,
                intervention_id=result.intervention_id,
                result=result.status,
            )
        )

