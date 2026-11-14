"""Paytm configuration + Test Mode Guard."""
from __future__ import annotations

from dataclasses import dataclass

from app.config import settings
from app.integrations.paytm.exceptions import PaytmConfigError

_TEST_MID_PREFIXES = ("TEST_", "STAGE_", "ptm_test_")


@dataclass(frozen=True)
class PaytmConfig:
    mid: str | None
    merchant_key: str | None
    webhook_secret: str | None
    base_url: str
    test_mode: bool
    timeout_seconds: float
    payment_link_expiry_minutes: int

    # client-internal retry knobs
    max_transient_retries: int = 2
    max_rate_limit_retries: int = 1
    backoff_base_seconds: float = 0.5
    backoff_max_seconds: float = 4.0

    @classmethod
    def from_settings(cls) -> "PaytmConfig":
        return cls(
            mid=settings.PAYTM_MID,
            merchant_key=settings.PAYTM_MERCHANT_KEY,
            webhook_secret=settings.PAYTM_WEBHOOK_SECRET,
            base_url=settings.PAYTM_BASE_URL.rstrip("/"),
            test_mode=bool(settings.PAYTM_TEST_MODE),
            timeout_seconds=float(settings.PAYTM_TIMEOUT_SECONDS),
            payment_link_expiry_minutes=max(
                15, int(settings.PAYTM_PAYMENT_LINK_EXPIRY_MINUTES)
            ),
        )

    @property
    def has_api_credentials(self) -> bool:
        return bool((self.mid or "").strip() and (self.merchant_key or "").strip())

    @property
    def has_webhook_secret(self) -> bool:
        return bool((self.webhook_secret or "").strip())

    @property
    def looks_like_test_mid(self) -> bool:
        mid = (self.mid or "").strip()
        return any(mid.startswith(p) for p in _TEST_MID_PREFIXES) or "TEST" in mid.upper()

    @property
    def is_ready(self) -> bool:
        return (
            self.test_mode
            and self.has_api_credentials
            and self.looks_like_test_mid
        )

    def status(self) -> dict[str, bool | str]:
        """Secret-free snapshot for inspection endpoint / audit trail."""
        return {
            "test_mode": self.test_mode,
            "base_url": self.base_url,
            "mid_configured": self.has_api_credentials,
            "mid_is_test_key": self.looks_like_test_mid,
            "webhook_secret_configured": self.has_webhook_secret,
            "ready_for_live_calls": self.is_ready,
        }

    def require_ready(self) -> None:
        """Enforces safe test-mode execution before making live calls."""
        if not self.test_mode:
            raise PaytmConfigError("Refusing live call: PAYTM_TEST_MODE must be True.")
        if not self.has_api_credentials:
            raise PaytmConfigError("Paytm credentials not configured in settings/env.")
        if not self.looks_like_test_mid:
            raise PaytmConfigError(
                f"Refusing call: Paytm MID '{self.mid}' does not appear to be a test/staging MID."
            )

