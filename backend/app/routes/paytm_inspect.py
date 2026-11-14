"""Safe, read-only inspection of a recovery event's Paytm state.

    GET /api/v1/recovery-events/{recovery_event_id}/paytm

Returns only non-sensitive identifiers (payment link id, short url, status,
payment id) plus the derived recovery state. No secrets, no raw payloads.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.agent.guardrails import load_event, payment_recovered
from app.database import get_db
from app.integrations.paytm import PaytmConfig

router = APIRouter(prefix="/api/v1/recovery-events", tags=["recovery-events"])


@router.get("/{recovery_event_id}/paytm")
def recovery_event_paytm(
    recovery_event_id: int,
    db: Session = Depends(get_db),
) -> dict:
    event = load_event(db, recovery_event_id)
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Recovery event not found."
        )

    interventions = []
    for i in sorted(event.interventions, key=lambda x: x.id):
        interventions.append(
            {
                "intervention_id": i.id,
                "action_type": i.action_type,
                "status": i.status,
                "paytm_payment_link_id": i.paytm_payment_link_id,
                "paytm_short_url": i.paytm_short_url,
                "paytm_reference_id": i.paytm_reference_id,
                "paytm_payment_id": i.paytm_payment_id,
                "last_paytm_status": i.last_paytm_status,
                "payment_link_created": i.paytm_payment_link_id is not None,
                "payment_link_paid": i.last_paytm_status == "paid",
                "outcome_recorded": i.outcome is not None,
                "outcome_payment_recovered": bool(
                    i.outcome and i.outcome.payment_recovered
                ),
                "recovered_amount_paise": (
                    i.outcome.recovered_amount_paise if i.outcome else None
                ),
            }
        )

    return {
        "recovery_event_id": event.id,
        "status": event.status,
        "is_control": event.is_control,
        "payment_recovered": payment_recovered(event),
        "payment_status": event.payment.status,
        "interventions": interventions,
        "paytm_config": PaytmConfig.from_settings().status(),
    }

