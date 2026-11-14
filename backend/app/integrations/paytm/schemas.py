"""Paytm data schemas."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any


@dataclass
class PaymentLinkCustomer:
    name: str | None = None
    email: str | None = None
    contact: str | None = None


@dataclass
class PaymentLinkCreateRequest:
    amount: int  # in paise
    currency: str = "INR"
    description: str | None = None
    customer: PaymentLinkCustomer | None = None
    reference_id: str | None = None
    expire_by: int | None = None  # unix epoch seconds
    notify: dict[str, bool] | None = None
    notes: dict[str, str] | None = None


@dataclass
class PaymentLink:
    id: str
    amount: int
    currency: str
    status: str  # created, paid, partially_paid, expired, cancelled
    short_url: str
    reference_id: str | None = None
    description: str | None = None
    amount_paid: int = 0
    raw: dict[str, Any] | None = None


@dataclass
class WebhookEnvelope:
    event: str
    event_id: str | None
    created_at: int | None
    payload: dict[str, Any]
    raw: dict[str, Any]

