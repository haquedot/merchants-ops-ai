"""Tests for Paytm webhook processing."""
from __future__ import annotations

from app.models.interventions import Intervention
from app.models.outcome import Outcome
from app.models.payment import Payment
from app.services.paytm_webhook import PaytmWebhookService
from tests.paytm.fakes import (
    TEST_WEBHOOK_SECRET,
    make_config,
    payment_link_paid_event,
    signed_webhook,
)


def _svc(db):
    return PaytmWebhookService(db, config=make_config())


def test_payment_link_paid_marks_recovered(paytm_db, linked_intervention):
    event_data = payment_link_paid_event(
        payment_link_id=linked_intervention["payment_link_id"],
        reference_id=linked_intervention["reference_id"],
        amount=49900,
    )
    raw, sig = signed_webhook(event_data)
    svc = _svc(paytm_db)
    res = svc.process(raw_body=raw, signature=sig, event_id="evt_pytest_001")
    assert res.status == "ok"
    assert res.payment_recovered is True

    iv = paytm_db.get(Intervention, linked_intervention["intervention_id"])
    assert iv.last_paytm_status == "paid"
    assert iv.outcome is not None
    assert iv.outcome.payment_recovered is True


def test_invalid_signature_rejected(paytm_db, linked_intervention):
    event_data = payment_link_paid_event(
        payment_link_id=linked_intervention["payment_link_id"],
        reference_id=linked_intervention["reference_id"],
        amount=49900,
    )
    raw, _ = signed_webhook(event_data)
    svc = _svc(paytm_db)
    res = svc.process(raw_body=raw, signature="invalid_signature", event_id="evt_pytest_002")
    assert res.status == "invalid_signature"
    assert res.http_status == 400

