# Paytm Test Mode Integration & End-to-End Flow

Stage status: **Paytm Test Mode and staging integration layer.**
A Test Mode Payment Link is created, paid with test credentials, and the `payment_link.paid` webhook confirms recovery end-to-end.

---

## 1. Architecture

```
                 ┌─────────────────────────────────────────────┐
   Gemini agent  │ app/agent/  (tool-calling loop)             │
                 └───────────────┬─────────────────────────────┘
                                 │  execute_recovery_action / observe_recovery_outcome
                 ┌───────────────▼─────────────────────────────┐
   guardrails    │ app/agent/guardrails.py  (authoritative)     │
                 └───────────────┬─────────────────────────────┘
                 ┌───────────────▼─────────────────────────────┐
   exec service  │ app/services/recovery_execution.py           │
                 │  • build request from AUTHORITATIVE payment  │
                 │  • idempotent link create / reuse           │
                 │  • persist correlation ids on Intervention  │
                 └───────────────┬─────────────────────────────┘
                 ┌───────────────▼─────────────────────────────┐
   adapter       │ app/integrations/paytm/  (HTTP only)        │
                 │  • stdlib urllib (zero external SDKs)       │
                 │  • test-mode key prefix guard (TEST_ / STAGE_)
                 │  • header redaction, retries on 5xx/429     │
                 └───────────────┬─────────────────────────────┘
                                 │ HTTPS
                                 ▼
                     Paytm Test Mode Gateway

                                 │ payment_link.paid (HMAC-SHA256 signed)
                                 ▼
                 ┌─────────────────────────────────────────────┐
   webhook       │ POST /api/v1/webhooks/paytm                 │
                 │  • constant-time signature verification      │
                 │  • idempotency via processed_webhook_events │
                 │  • creates Outcome (payment_recovered=true) │
                 │  • closes RecoveryEvent, updates Payment    │
                 └─────────────────────────────────────────────┘
```

## 2. Invariants
1. **Creation is NOT recovery:** A created Payment Link is never counted as money recovered until confirmed by a signature-verified webhook.
2. **Server-authoritative amounts:** The LLM cannot specify payment amounts; amounts are strictly pulled from the database ledger.
3. **Idempotency:** Webhook events are deduplicated by event ID to prevent duplicate credit/recovery processing.

