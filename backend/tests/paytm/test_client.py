"""Unit tests for the minimal PaytmClient."""
from __future__ import annotations

import pytest

from app.integrations.paytm.client import PaytmClient
from app.integrations.paytm.exceptions import (
    PaytmAuthError,
    PaytmRateLimitError,
    PaytmTransientError,
    PaytmValidationError,
)
from app.integrations.paytm.schemas import PaymentLinkCreateRequest
from tests.paytm.fakes import FakePaytmTransport, make_config


def test_create_payment_link_success():
    transport = FakePaytmTransport()
    client = PaytmClient(make_config(), transport=transport)
    link = client.create_payment_link(
        PaymentLinkCreateRequest(amount=50000, reference_id="ref_01")
    )
    assert link.amount == 50000
    assert link.status == "created"
    assert link.reference_id == "ref_01"
    assert len(transport.create_calls) == 1


def test_fetch_payment_link_success():
    transport = FakePaytmTransport()
    client = PaytmClient(make_config(), transport=transport)
    link = client.fetch_payment_link("ptm_link_TEST0001")
    assert link.id == "ptm_link_TEST0001"


def test_auth_error_raises():
    transport = FakePaytmTransport()
    transport.queue(401, {"error": "unauthorized"})
    client = PaytmClient(make_config(), transport=transport)
    with pytest.raises(PaytmAuthError):
        client.create_payment_link(PaymentLinkCreateRequest(amount=1000))

