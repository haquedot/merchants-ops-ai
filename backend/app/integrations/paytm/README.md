# Paytm Integration Layer

This package provides a minimal, dependency-free client for Paytm payment and staging services.

## Components
- `PaytmConfig`: Typed configuration with strict test-mode safety guards.
- `PaytmClient`: Python stdlib `urllib` HTTP client with retries, backoff, and header redaction.
- `webhooks`: Constant-time HMAC SHA-256 signature verification for incoming Paytm notifications.
- `schemas`: Typed data structures for payment links, customer info, and webhook envelopes.

