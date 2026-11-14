"""Idempotency tests for Paytm execution."""
from __future__ import annotations

from app.integrations.paytm.client import PaytmClient
from app.models.interventions import Intervention
from app.services.recovery_execution import RecoveryExecutionService
from tests.paytm.fakes import FakePaytmTransport, make_config


def test_create_link_idempotency(paytm_db, linked_intervention):
    transport = FakePaytmTransport()
    client = PaytmClient(make_config(), transport=transport)
    svc = RecoveryExecutionService(paytm_db, client=client)

    iv = paytm_db.get(Intervention, linked_intervention["intervention_id"])
    result = svc.create_payment_link(iv)

    assert result.success is True
    assert result.reused is True
    assert result.payment_link_id == linked_intervention["payment_link_id"]

