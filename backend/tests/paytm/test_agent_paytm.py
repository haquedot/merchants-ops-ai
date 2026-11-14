"""Agent <-> Paytm integration test."""
from __future__ import annotations

from app.agent.agent import RecoveryAgent
from app.agent.config import AgentConfig
from app.integrations.paytm.client import PaytmClient
from app.models.interventions import Intervention
from tests.agent.fakes import ScriptedProvider
from tests.paytm.fakes import FakePaytmTransport, make_config


def test_agent_creates_paytm_payment_link(paytm_db, fresh_event_id):
    transport = FakePaytmTransport()
    client = PaytmClient(make_config(), transport=transport)
    prov = ScriptedProvider([
        ("get_recovery_event_context", {}),
        ("execute_recovery_action", {
            "action_type": "whatsapp_nudge",
            "customer_message": "Pay via Paytm link",
            "reason": "testing paytm link creation",
        }),
        ("stop_recovery", {"stop_reason": "action_executed_awaiting_outcome", "reasoning_summary": "done"}),
    ])
    cfg = AgentConfig(model="mock", max_turns=4)
    agent = RecoveryAgent(paytm_db, prov, cfg, paytm_client=client)
    state = agent.run(fresh_event_id, dry_run=False)

    assert state.chosen_action == "whatsapp_nudge"
    iv = paytm_db.query(Intervention).filter_by(recovery_event_id=fresh_event_id).first()
    assert iv is not None
    assert iv.paytm_payment_link_id is not None
    assert iv.paytm_payment_link_id.startswith("ptm_link_TEST")
