"""Paytm webhook receiver.

    POST /api/v1/webhooks/paytm

The raw request body is read byte-for-byte and handed to :class:`PaytmWebhookService`,
which verifies the signature before parsing, correlates the event, applies the
state change exactly once, and is idempotent against duplicate deliveries.
"""
from __future__ import annotations

from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.integrations.paytm import EVENT_ID_HEADER, SIGNATURE_HEADER
from app.integrations.paytm.exceptions import PaytmConfigError
from app.services.paytm_webhook import PaytmWebhookService

router = APIRouter(prefix="/api/v1/webhooks", tags=["webhooks"])


@router.post("/paytm")
async def paytm_webhook(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    raw_body = await request.body()
    signature = request.headers.get(SIGNATURE_HEADER)
    event_id = request.headers.get(EVENT_ID_HEADER)

    try:
        service = PaytmWebhookService(db)
        result = service.process(
            raw_body=raw_body, signature=signature, event_id=event_id
        )
    except PaytmConfigError:
        response.status_code = 503
        return {"status": "webhook_not_configured"}

    response.status_code = result.http_status
    return result.body()
