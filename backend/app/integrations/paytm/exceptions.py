"""Exceptions for the Paytm integration."""
from __future__ import annotations


class PaytmError(Exception):
    """Base exception for all Paytm integration errors."""


class PaytmConfigError(PaytmError):
    """Configuration is missing, incomplete, or invalid."""


class PaytmTransientError(PaytmError):
    """Temporary failure (e.g. timeout, 5xx server error, network reset) suitable for retry."""


class PaytmRateLimitError(PaytmTransientError):
    """HTTP 429 Too Many Requests."""


class PaytmValidationError(PaytmError):
    """HTTP 400 Bad Request or semantic validation failure; not retryable."""


class PaytmAuthError(PaytmError):
    """HTTP 401 Unauthorized or 403 Forbidden; not retryable."""


class PaytmMalformedResponse(PaytmError):
    """Response payload could not be parsed as valid JSON or missing expected fields."""


class WebhookSignatureError(PaytmError):
    """HMAC/Checksum signature verification failed for incoming webhook."""

