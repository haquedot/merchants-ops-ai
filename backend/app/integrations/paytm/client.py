"""Paytm REST client using Python stdlib (no external dependencies)."""
from __future__ import annotations

import base64
import json
import socket
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Callable

from app.integrations.paytm.config import PaytmConfig
from app.integrations.paytm.exceptions import (
    PaytmAuthError,
    PaytmMalformedResponse,
    PaytmRateLimitError,
    PaytmTransientError,
    PaytmValidationError,
)
from app.integrations.paytm.schemas import PaymentLink, PaymentLinkCreateRequest

Transport = Callable[[str, str, dict[str, str], bytes | None], tuple[int, dict[str, str], bytes]]

_REDACTED = "***redacted***"


def _redact(headers: dict[str, str]) -> dict[str, str]:
    return {
        k: (_REDACTED if k.lower() in {"authorization", "x-paytm-signature", "x-checksum"} else v)
        for k, v in headers.items()
    }


class PaytmClient:
    def __init__(
        self,
        config: PaytmConfig | None = None,
        *,
        transport: Transport | None = None,
    ) -> None:
        self.config = config or PaytmConfig.from_settings()
        self._transport = transport

    def _default_transport(
        self, method: str, url: str, headers: dict[str, str], body: bytes | None
    ) -> tuple[int, dict[str, str], bytes]:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme.lower() != "https" and not (
            parsed.hostname in {"localhost", "127.0.0.1"} and self.config.test_mode
        ):
            raise PaytmValidationError(f"Insecure URL scheme '{parsed.scheme}'; HTTPS is required.")

        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=self.config.timeout_seconds) as resp:
                status = resp.status
                resp_headers = dict(resp.headers)
                resp_body = resp.read()
                return status, resp_headers, resp_body
        except urllib.error.HTTPError as exc:
            return exc.code, dict(exc.headers), exc.read()
        except (urllib.error.URLError, socket.timeout, ConnectionResetError) as exc:
            raise PaytmTransientError(f"Network transport failure: {exc}") from exc

    def _request(
        self, method: str, path: str, json_body: dict[str, Any] | None = None
    ) -> dict[str, Any]:
        self.config.require_ready()
        url = f"{self.config.base_url}/{path.lstrip('/')}"

        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Paytm-Mid": str(self.config.mid),
        }
        if self.config.merchant_key:
            auth_str = f"{self.config.mid}:{self.config.merchant_key}"
            headers["Authorization"] = f"Basic {base64.b64encode(auth_str.encode()).decode()}"

        body_bytes = json.dumps(json_body).encode("utf-8") if json_body else None
        transport_fn = self._transport or self._default_transport

        last_error: Exception | None = None
        for attempt in range(self.config.max_transient_retries + 1):
            try:
                status_code, resp_headers, raw_resp = transport_fn(
                    method, url, headers, body_bytes
                )
            except PaytmTransientError as exc:
                last_error = exc
                if attempt < self.config.max_transient_retries:
                    time.sleep(self.config.backoff_base_seconds * (2**attempt))
                    continue
                raise

            if status_code in (200, 201):
                try:
                    return json.loads(raw_resp.decode("utf-8"))
                except Exception as exc:
                    raise PaytmMalformedResponse("Failed to parse response JSON") from exc

            if status_code == 400:
                raise PaytmValidationError(f"Bad Request: {raw_resp.decode('utf-8', errors='ignore')}")
            if status_code in (401, 403):
                raise PaytmAuthError("Unauthorized / Forbidden Paytm credentials")
            if status_code == 429:
                if attempt < self.config.max_rate_limit_retries:
                    time.sleep(1.0)
                    continue
                raise PaytmRateLimitError("Paytm rate limit exceeded")
            if status_code >= 500:
                last_error = PaytmTransientError(f"Paytm server error {status_code}")
                if attempt < self.config.max_transient_retries:
                    time.sleep(self.config.backoff_base_seconds * (2**attempt))
                    continue
                raise last_error

            raise PaytmValidationError(f"Unexpected status {status_code}: {raw_resp.decode('utf-8', errors='ignore')}")

        if last_error:
            raise last_error
        raise PaytmTransientError("Request attempts exhausted")

    def create_payment_link(self, req: PaymentLinkCreateRequest) -> PaymentLink:
        payload: dict[str, Any] = {
            "amount": req.amount,
            "currency": req.currency,
            "description": req.description or "Paytm Merchant Recovery Link",
            "reference_id": req.reference_id,
        }
        if req.customer:
            payload["customer"] = {
                "name": req.customer.name,
                "email": req.customer.email,
                "contact": req.customer.contact,
            }
        if req.expire_by:
            payload["expire_by"] = req.expire_by

        res = self._request("POST", "v1/payment_links", payload)
        return PaymentLink(
            id=res.get("id", f"ptm_link_{req.reference_id}"),
            amount=res.get("amount", req.amount),
            currency=res.get("currency", req.currency),
            status=res.get("status", "created"),
            short_url=res.get("short_url", f"https://paytm.me/{res.get('id', 'link')}"),
            reference_id=res.get("reference_id", req.reference_id),
            description=res.get("description", req.description),
            amount_paid=res.get("amount_paid", 0),
            raw=res,
        )

    def fetch_payment_link(self, link_id: str) -> PaymentLink:
        res = self._request("GET", f"v1/payment_links/{link_id}")
        return PaymentLink(
            id=res.get("id", link_id),
            amount=res.get("amount", 0),
            currency=res.get("currency", "INR"),
            status=res.get("status", "created"),
            short_url=res.get("short_url", f"https://paytm.me/{link_id}"),
            reference_id=res.get("reference_id"),
            description=res.get("description"),
            amount_paid=res.get("amount_paid", 0),
            raw=res,
        )

