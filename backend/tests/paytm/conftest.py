"""DB fixtures for Paytm webhook / execution / agent-integration tests."""
from __future__ import annotations

from datetime import datetime, timezone

import pytest
from sqlalchemy import delete

from app.database import SessionLocal
from app.models.interventions import Intervention
from app.models.webhook_event import ProcessedWebhookEvent
from app.services.recovery_execution import reference_id_for
from tests.agent.conftest import _cleanup, _make_event


@pytest.fixture
def paytm_db():
    s = SessionLocal()
    _cleanup(s)
    s.execute(
        delete(ProcessedWebhookEvent).where(
            ProcessedWebhookEvent.event_id.like("evt_pytest_%")
        )
    )
    s.commit()
    try:
        yield s
    finally:
        s.execute(
            delete(ProcessedWebhookEvent).where(
                ProcessedWebhookEvent.event_id.like("evt_pytest_%")
            )
        )
        s.commit()
        _cleanup(s)
        s.rollback()
        s.close()


@pytest.fixture
def fresh_event_id(paytm_db) -> int:
    return _make_event(paytm_db)


@pytest.fixture
def linked_intervention(paytm_db):
    """A fresh event + one intervention with a Paytm Payment Link."""
    event_id = _make_event(paytm_db)
    iv = Intervention(
        recovery_event_id=event_id,
        action_type="whatsapp_nudge",
        status="executed",
        cost_paise=80,
        agent_reason="[gemini] test",
        executed_at=datetime.now(timezone.utc),
    )
    paytm_db.add(iv)
    paytm_db.flush()
    ref = reference_id_for(event_id, iv.id)
    iv.paytm_reference_id = ref
    iv.paytm_payment_link_id = f"ptm_link_pytest_{iv.id}"
    iv.paytm_short_url = "https://paytm.me/pytest"
    iv.last_paytm_status = "created"
    paytm_db.commit()
    return {
        "recovery_event_id": event_id,
        "intervention_id": iv.id,
        "payment_link_id": iv.paytm_payment_link_id,
        "reference_id": ref,
    }

