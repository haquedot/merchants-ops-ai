"""Paytm webhook signature verification."""
from __future__ import annotations

import hmac
import hashlib

from app.integrations.paytm.exceptions import WebhookSignatureError

SIGNATURE_HEADER = "x-paytm-signature"
EVENT_ID_HEADER = "x-paytm-event-id"


def compute_signature(payload_bytes: bytes, secret: str) -> str:
    """Computes SHA256 HMAC for Paytm webhook payloads."""
    return hmac.new(
        secret.encode("utf-8"),
        payload_bytes,
        hashlib.sha256,
    ).hexdigest()


def verify_signature(
    payload_bytes: bytes,
    signature_header_value: str | None,
    secret: str | None,
) -> bool:
    """Verifies that the incoming webhook signature matches the expected HMAC."""
    if not signature_header_value or not secret:
        raise WebhookSignatureError("Missing webhook signature or webhook secret.")

    expected = compute_signature(payload_bytes, secret)
    # Constant-time comparison
    if not hmac.compare_digest(expected, signature_header_value.strip()):
        raise WebhookSignatureError("Paytm webhook signature verification failed.")

    return True

