"""Paytm integration package.

Provides typed config, a stdlib REST client for Paytm staging/test APIs,
webhook signature verification, and standard schemas.
"""
from app.integrations.paytm.config import PaytmConfig
from app.integrations.paytm.client import PaytmClient
from app.integrations.paytm.exceptions import (
    PaytmAuthError,
    PaytmConfigError,
    PaytmError,
    PaytmMalformedResponse,
    PaytmRateLimitError,
    PaytmTransientError,
    PaytmValidationError,
    WebhookSignatureError,
)
from app.integrations.paytm.schemas import (
    PaymentLink,
    PaymentLinkCreateRequest,
    PaymentLinkCustomer,
    WebhookEnvelope,
)
from app.integrations.paytm.webhooks import (
    EVENT_ID_HEADER,
    SIGNATURE_HEADER,
    compute_signature,
    verify_signature,
)

__all__ = [
    "EVENT_ID_HEADER",
    "SIGNATURE_HEADER",
    "PaymentLink",
    "PaymentLinkCreateRequest",
    "PaymentLinkCustomer",
    "PaytmAuthError",
    "PaytmClient",
    "PaytmConfig",
    "PaytmConfigError",
    "PaytmError",
    "PaytmMalformedResponse",
    "PaytmRateLimitError",
    "PaytmTransientError",
    "PaytmValidationError",
    "WebhookEnvelope",
    "WebhookSignatureError",
    "compute_signature",
    "verify_signature",
]

