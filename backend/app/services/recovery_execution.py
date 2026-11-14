"""Recovery execution service -- the boundary between the agent tool and the
Paytm adapter.

    Gemini -> execute_recovery_action tool -> [guardrails] -> THIS SERVICE
        -> app.integrations.paytm adapter -> Paytm Test Mode API

Responsibilities:
* build the Payment Link request from authoritative server-side payment data;
* idempotent Payment Link creation, keyed on reference_id and paytm_payment_link_id;
* persist the Paytm correlation ids on the Intervention;
* map Paytm errors to a concise, secret-free result the agent can reason over.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any

from sqlalchemy.orm import Session

from app.integrations.paytm import (
    PaymentLink,
    PaymentLinkCreateRequest,
    PaymentLinkCustomer,
    PaytmClient,
    PaytmConfig,
    PaytmError,
    PaytmValidationError,
)
from app.models.audit_log import AuditLog
from app.models.interventions import Intervention
from app.models.recovery_events import RecoveryEvent

EXECUTION_ACTOR = "recovery_execution_service"


def reference_id_for(recovery_event_id: int, intervention_id: int) -> str:
    return f"recovery-{recovery_event_id}-{intervention_id}"


@dataclass
class ExecutionResult:
    action_type: str
    intervention_id: int
    success: bool
    dry_run: bool = False
    reused: bool = False
    communication_sent: bool = False
    payment_link_id: str | None = None
    payment_link_url: str | None = None
    reference_id: str | None = None
    paytm_status: str | None = None
    amount_paise: int | None = None
    currency: str | None = None
    error_code: str | None = None
    error_summary: str | None = None

    def as_tool_payload(self) -> dict[str, Any]:
        """Compact, secret-free view for the agent tool result."""
        payload: dict[str, Any] = {
            "action": self.action_type,
            "intervention_id": self.intervention_id,
            "success": self.success,
            "dry_run": self.dry_run,
            "reused_existing_link": self.reused,
            "communication_sent": self.communication_sent,
            "payment_recovered": False,
        }
        if self.success:
            payload.update(
                {
                    "paytm_payment_link_id": self.payment_link_id,
                    "payment_link_url": self.payment_link_url,
                    "paytm_status": self.paytm_status,
                    "amount_paise": self.amount_paise,
                    "currency": self.currency,
                    "next_observation_recommendation": (
                        "call observe_recovery_outcome later; the link is created "
                        "but NOT paid -- payment_recovered stays false until a "
                        "verified webhook confirms payment"
                    ),
                }
            )
        else:
            payload.update(
                {"error": self.error_code, "error_detail": self.error_summary}
            )
        return payload


class RecoveryExecutionService:
    def __init__(
        self,
        db: Session,
        *,
        client: PaytmClient | None = None,
        config: PaytmConfig | None = None,
    ) -> None:
        self.db = db
        self.config = config or PaytmConfig.from_settings()
        self._client = client

    def _get_client(self) -> PaytmClient:
        if self._client is None:
            self.config.require_ready()
            self._client = PaytmClient(self.config)
        return self._client

    def create_payment_link(
        self, intervention: Intervention, *, reason: str = ""
    ) -> ExecutionResult:
        """Idempotently create (or reuse) the Paytm Payment Link for this intervention."""
        event: RecoveryEvent = intervention.recovery_event
        payment = event.payment
        ref = reference_id_for(event.id, intervention.id)

        # 1. Already have a link for this intervention -> reuse it.
        if intervention.paytm_payment_link_id:
            return self._reuse(intervention, ref)

        # 2. Config guard.
        try:
            client = self._get_client()
        except PaytmError as exc:
            return self._failure(intervention, exc, ref)

        # 3. Build the request from server data.
        request = self._build_request(event, intervention, payment, ref)

        # 4. Create.
        try:
            link = client.create_payment_link(request)
        except PaytmError as exc:
            return self._failure(intervention, exc, ref)

        self._persist_link(intervention, link, ref, reason)
        return ExecutionResult(
            action_type=intervention.action_type,
            intervention_id=intervention.id,
            success=True,
            reused=False,
            payment_link_id=link.id,
            payment_link_url=link.short_url,
            reference_id=ref,
            paytm_status=link.status,
            amount_paise=payment.amount,
            currency=payment.currency,
        )

    def _build_request(
        self, event: RecoveryEvent, intervention: Intervention, payment, ref: str
    ) -> PaymentLinkCreateRequest:
        customer = payment.subscription.customer
        expiry_minutes = self.config.payment_link_expiry_minutes
        expire_by = int(
            (datetime.now(timezone.utc) + timedelta(minutes=expiry_minutes)).timestamp()
        )
        attempt = len(event.interventions)
        return PaymentLinkCreateRequest(
            amount=int(payment.amount),
            currency=payment.currency or "INR",
            reference_id=ref,
            description=(
                f"Payment recovery for subscription "
                f"{payment.subscription.external_subscription_id} "
                f"(recovery event {event.id}, attempt {attempt})"
            )[:2048],
            customer=PaymentLinkCustomer(
                email=(customer.email or None),
                contact=(customer.phone or None),
            ),
            notify={"sms": False, "email": False},
            expire_by=expire_by,
        )

    def _reuse(self, intervention: Intervention, ref: str) -> ExecutionResult:
        status = intervention.last_paytm_status
        try:
            link = self._get_client().fetch_payment_link(
                intervention.paytm_payment_link_id  # type: ignore[arg-type]
            )
            status = link.status
            if link.status != intervention.last_paytm_status:
                intervention.last_paytm_status = link.status
                self.db.flush()
        except PaytmError:
            pass
        return ExecutionResult(
            action_type=intervention.action_type,
            intervention_id=intervention.id,
            success=True,
            reused=True,
            payment_link_id=intervention.paytm_payment_link_id,
            payment_link_url=intervention.paytm_short_url,
            reference_id=ref,
            paytm_status=status,
            amount_paise=intervention.recovery_event.payment.amount,
            currency=intervention.recovery_event.payment.currency,
        )

    def _persist_link(
        self, intervention: Intervention, link: PaymentLink, ref: str, reason: str
    ) -> None:
        intervention.paytm_reference_id = ref
        intervention.paytm_payment_link_id = link.id
        intervention.paytm_short_url = link.short_url
        intervention.last_paytm_status = link.status
        intervention.status = "executed"
        intervention.executed_at = datetime.now(timezone.utc)
        self.db.add(
            AuditLog(
                recovery_event_id=intervention.recovery_event_id,
                actor=EXECUTION_ACTOR,
                action=f"paytm_payment_link_created_{intervention.action_type}",
                reason=(reason or "paytm payment link created for recovery")[:500],
                event_metadata={
                    "intervention_id": intervention.id,
                    "paytm_payment_link_id": link.id,
                    "reference_id": ref,
                    "paytm_status": link.status,
                    "amount_paise": link.amount,
                },
            )
        )
        self.db.flush()

    def _failure(
        self, intervention: Intervention, exc: Exception, ref: str
    ) -> ExecutionResult:
        err_msg = str(exc)
        self.db.add(
            AuditLog(
                recovery_event_id=intervention.recovery_event_id,
                actor=EXECUTION_ACTOR,
                action=f"paytm_payment_link_failed_{intervention.action_type}",
                reason=err_msg[:500],
                event_metadata={
                    "intervention_id": intervention.id,
                    "reference_id": ref,
                    "error_type": type(exc).__name__,
                },
            )
        )
        self.db.flush()
        return ExecutionResult(
            action_type=intervention.action_type,
            intervention_id=intervention.id,
            success=False,
            error_code=type(exc).__name__,
            error_summary=err_msg,
            reference_id=ref,
        )
