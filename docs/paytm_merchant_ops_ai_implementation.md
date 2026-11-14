# Paytm MerchantOps AI — Autonomous Merchant Teammate
## Implementation Blueprint & Hackathon Execution Plan

**Event:** Paytm Build for India AI Hackathon (Hyderabad Edition — Nov 14, 2026)  
**Track:** Track 3 — Autonomous AI Teammates  
**Theme:** *"Build AI teammates that don't just respond; they get the job done."*  
**Project Name:** **Paytm MerchantOps AI** (*Paytm Saathi*)  
**Repository Working Directory:** `e:\merchants-ops-ai`

---

## 1. Executive Summary & Alignment with Hackathon Prompt

### The Prompt
> *"Design an AI teammate that can go beyond answering questions and deliver measurable outcomes in sales or customer service. The AI should understand context, make decisions, take actions, and work alongside human teams. How might we build an AI teammate that can independently handle a customer-service or sales workflow end-to-end - resolving issues, taking actions across systems, and escalating to humans only when needed?"*

### Our Solution: Paytm MerchantOps AI
Over 40 million merchants across India depend on Paytm daily for UPI QR payments, the iconic **Paytm Soundbox**, POS/EDC machines, and daily settlements. When a payment fails or a Soundbox goes silent during peak shop hours, the merchant loses business and panics. 

Existing customer service bots are passive: they give generic advice (*"Please wait 24-48 hours"*), force the merchant through frustrating IVR trees, or create dead-end support tickets.

**Paytm MerchantOps AI is an autonomous, action-taking AI teammate** that acts as a Level-1/Level-2 Merchant Operations Support Engineer:
1. **Understands Context:** Ingests merchant profile, store traffic, transaction history, and Soundbox hardware telemetry.
2. **Investigates Root Causes:** Queries Paytm internal ledgers, bank NPCI status, and device IoT diagnostics via tool calling.
3. **Takes Deterministic Actions Across Systems:** Replays missed voice announcements, resets IoT connection profiles, releases unblocked settlement credits, or schedules field repairs.
4. **Enforces Strict Guardrails:** The LLM proposes actions, but deterministic backend safety policies govern financial limits and permissions.
5. **Collaborates with Human Teammates:** Solves 80%+ of routine operational issues autonomously, and hands off complex/high-value edge cases to human ops agents with complete structured investigation briefs.

```
+-----------------------------------------------------------------------------------+
|                            PAYTM MERCHANTOPS AI ARCHITECTURE                      |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ Merchant Interface ]                 [ Operations Cockpit (Human Teammate) ]   |
|   - Hinglish Voice / Text Chat           - Live Issue Triage Queue                |
|   - Real-time Diagnostic Status          - Human-in-the-Loop Approval & Escalation|
|                    \                         /                                    |
|                     v                       v                                     |
|               +-----------------------------------+                               |
|               |       FastAPI Gateway / Core      |                               |
|               +-----------------------------------+                               |
|                                 |                                                 |
|                                 v                                                 |
|               +-----------------------------------+                               |
|               |  Autonomous Agent Loop (Gemini)   |                               |
|               |  - Multi-turn tool reasoning      |                               |
|               |  - Self-correcting reflection     |                               |
|               +-----------------------------------+                               |
|                     /           |           \                                     |
|                    v            v            v                                    |
|             [Context Tools] [Action Tools] [Safety Guardrails]                    |
|                    |            |            |                                    |
|                    v            v            v                                    |
|       +-------------------------------------------------------+                   |
|       |                 Paytm Subsystem Adapters              |                   |
|       |  - Core Ledger / UPI Switch (Txn verification)        |                   |
|       |  - Soundbox IoT Cloud (Heartbeat, SIM, Audio replay)  |                   |
|       |  - Settlement & Credit Engine (Instant reconciler)    |                   |
|       |  - Field Ops CRM (Ticketing & Technician dispatch)    |                   |
|       +-------------------------------------------------------+                   |
|                                 |                                                 |
|                                 v                                                 |
|               +-----------------------------------+                               |
|               |    Verified Outcomes & Audit DB   |                               |
|               +-----------------------------------+                               |
+-----------------------------------------------------------------------------------+
```

---

## 2. Adapting Our Existing Codebase (`Reclaim` -> `Paytm MerchantOps AI`)

We are leveraging our proven, production-grade agent foundation (`e:\merchants-ops-ai`) and adapting it from single-purpose payment recovery into an all-around **Paytm Merchant Operations AI Teammate**:

| Existing Foundation (`Reclaim`) | Paytm Hackathon Adaptation (`Paytm MerchantOps AI`) |
|---|---|
| **FastAPI Backend (`backend/app`)** | Retained as the operational backend with specialized Paytm domain routers (`/api/v1/merchant-ops`, `/api/v1/soundbox`, `/api/v1/tickets`). |
| **Tool-Calling Agent (`app/agent`)** | Refactored from Razorpay recovery into Paytm Merchant Support Agent with Paytm diagnostic and action tools. |
| **Deterministic Guardrails (`guardrails.py`)** | Repurposed for support safety: prevents unauthorized refunds/credits, enforces daily merchant limits, mandates human escalation. |
| **Razorpay API Adapter** | Swapped with a high-fidelity **Paytm Mock Subsystems Suite** (Core Ledger, NPCI Bank Switch, Soundbox Device Cloud, Field Ops). |
| **Portfolio Scarcity Allocator** | Repurposed as **Operations Priority Triage**: ranks incoming merchant issues by business impact (VIP merchant, high volume, prolonged downtime). |
| **Autonomous Scheduler** | Repurposed as **Proactive Merchant Sentinel**: autonomously detects failing Soundboxes or stuck settlement batches before the merchant even calls. |
| **React + Vite Frontend (`frontend/`)** | Transformed into the **Paytm Merchant Ops Cockpit**: includes Merchant Simulator, Live Diagnostics, Human Ops Queue, and System Telemetry. |
| **Local Hinglish TTS (`pyttsx3`)** | Retained to provide voice support in natural Hinglish for Indian shopkeepers. |

---

## 3. The Three Core End-to-End Workflows

### Workflow 1: Soundbox Alert & Device Hardware Troubleshooting
* **Scenario:** A kirana store merchant in Hyderabad is in the middle of morning rush. A customer shows a completed UPI screen for ₹250, but the Soundbox makes no sound. The merchant is agitated.
* **Agent Flow:**
  1. **Listen & Understand:** Merchant inputs (text/voice): *"Soundbox me aawaz nahi aayi ₹250 ki, customer chala gaya!"*
  2. **Query Device Telemetry (`check_soundbox_telemetry`):**
     - Status: Online (Signal: 2/5 bars, Airtel SIM)
     - Battery: 18% (Low battery warning)
     - Volume: Set to Level 1 (accidentally muted)
  3. **Query Core Ledger (`query_transaction_status`):**
     - Confirms payment of ₹250 was successfully captured at 11:28 AM for Order `PAYTM_TXN_9872`.
  4. **Perform Corrective Actions (`take_soundbox_action`):**
     - Step 1: Remotely sets Soundbox volume to Level 5.
     - Step 2: Dispatches cloud command to replay the specific audio notification: *"Paytm par do sau pachaas rupaye prapt hue"*.
     - Step 3: Sends SMS/WhatsApp summary link to merchant with transaction reference.
  5. **Outcome:** Issue resolved within 10 seconds without human intervention.

### Workflow 2: Failed/Pending UPI Transaction & Settlement Reconciliation
* **Scenario:** A merchant is waiting for yesterday's settlement (₹14,500) or reports that a customer's ₹1,200 payment failed at their QR code.
* **Agent Flow:**
  1. **Investigate Bank Switch (`check_npci_bank_health`):**
     - Queries NPCI health: HDFC bank switch had 14% failure rate between 10:00-10:15 AM.
  2. **Audit Payment Lifecycle (`trace_payment_lifecycle`):**
     - Detects payment `TXN_4491` is in `PENDING_REVERSAL` state.
  3. **Check Merchant Trust & Guardrails (`evaluate_merchant_credit_eligibility`):**
     - Merchant has 18 months of clean history, daily volume > ₹10,000.
  4. **Execute Safe Settlement Action (`issue_instant_provisional_credit`):**
     - Applies a provisional ₹1,200 ledger credit so the merchant can safely hand over groceries to the customer without risk.
     - If transaction ultimately fails, auto-adjusted against midnight settlement batch.
  5. **Outcome:** Avoids merchant-customer dispute, protects merchant revenue.

### Workflow 3: Autonomous Triage & Human Teammate Escalation
* **Scenario:** Hardware failure (Soundbox motherboard water damage or damaged charging port) or disputed charge > ₹25,000.
* **Agent Flow:**
  1. **Detect Unresolvable Hardware State:** Device telemetry reports error code `ERR_HW_AUDIO_CODEC_FAILURE`. Replay commands fail.
  2. **Autonomous Decision:** Cannot be resolved remotely via software. Guardrails forbid automatic replacement dispatch without human approval if store is new.
  3. **Prepare Structured Handoff:**
     - Computes issue priority: `URGENT` (Device dead at active grocery store).
     - Assembles Handoff Dossier: Merchant details, Diagnostic logs, Failed recovery steps, Recommended action: `Dispatch Field Technician (EDC/Soundbox Swap)`.
  4. **Alert Human Teammate:** Pushes to the Ops Dashboard with 1-click `Approve Technician Dispatch` button.
  5. **Outcome:** Human teammate saves 15 minutes of investigation; acts immediately.

---

## 4. Technical Architecture & File Structure

```
e:\merchants-ops-ai\
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entry point & CORS
│   │   ├── config.py                   # Environment settings (Gemini, DB, etc.)
│   │   ├── database.py                 # SQLite / PostgreSQL connection
│   │   ├── models/                     # SQLAlchemy models
│   │   │   ├── merchant.py             # Merchant details & store profile
│   │   │   ├── soundbox.py             # Soundbox device state & telemetry
│   │   │   ├── transaction.py          # UPI transactions & settlements
│   │   │   ├── support_ticket.py       # Support cases & escalation queue
│   │   │   └── audit_log.py            # Complete audit trail of actions
│   │   ├── agent/                      # The Autonomous AI Teammate
│   │   │   ├── runner.py               # Orchestrator running the agent turn loop
│   │   │   ├── prompts.py              # System prompt defining Paytm Teammate persona
│   │   │   ├── guardrails.py           # Safety policies & deterministic limits
│   │   │   ├── providers/
│   │   │   │   └── gemini.py           # Gemini 1.5/2.0 REST tool calling
│   │   │   └── tools/
│   │   │       ├── context_tools.py    # Read merchant context, device status, ledger
│   │   │       ├── diagnostic_tools.py # Soundbox network, battery, NPCI status
│   │   │       ├── action_tools.py     # Voice replay, volume set, ticket, credit
│   │   │       └── escalation_tools.py # Handoff to human ops with structured dossier
│   │   ├── mock_paytm/                 # High-fidelity simulated Paytm subsystems
│   │   │   ├── soundbox_iot_service.py # Mock device cloud (volume, replay, ping)
│   │   │   ├── core_ledger_service.py  # Mock UPI switch & transaction ledger
│   │   │   └── field_ops_service.py    # Mock technician dispatch & ticketing
│   │   └── api/
│   │       ├── v1/
│   │       │   ├── merchant_ops.py     # Chat, run agent, trigger resolution
│   │       │   ├── human_ops.py        # Dashboard queue for human teammate
│   │       │   ├── soundbox.py         # Device diagnostics endpoints
│   │       │   └── voice.py            # Audio generation / TTS playback
│   ├── scripts/
│   │   └── seed_paytm_data.py          # Seeds merchants, soundboxes, and sample issues
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MerchantChat.tsx        # Simulated merchant mobile view (voice/chat)
│   │   │   ├── OpsCockpit.tsx          # Human teammate control center & live queue
│   │   │   ├── SoundboxTelemetry.tsx   # Live visual inspection of device state
│   │   │   ├── HandoffModal.tsx        # Structured human escalation review
│   │   │   └── AuditTimeline.tsx       # Every tool call & guardrail check verified
│   │   ├── pages/
│   │   │   └── Dashboard.tsx           # Unified multi-pane hackathon demo interface
│   │   └── App.tsx
│   └── package.json
```

---

## 5. Implementation Details: Agent Tools & Guardrails

### 5.1 Agent Tool Catalog

#### 1. Context & Diagnostic Tools (Read-Only)
* `get_merchant_profile(merchant_id: str)`: Returns business type, monthly volume, active services (Soundbox, QR, POS), KYC tier.
* `get_soundbox_diagnostics(device_id: str)`: Returns battery percentage, GSM signal quality (CSQ), firmware version, audio mute status, last heartbeat timestamp.
* `verify_transaction(order_id: str, amount: float)`: Checks core ledger and NPCI switch for matching payment status, customer VPA, and bank RRN.
* `check_settlement_status(merchant_id: str, date: str)`: Returns daily balance, scheduled payout time, held reserve amounts, or bank reconciliation delay.

#### 2. Action Tools (State-Altering)
* `trigger_soundbox_chime(device_id: str, amount: float, language: str)`: Dispatches remote cloud MQTT event to trigger the speaker announcement.
* `configure_soundbox_audio(device_id: str, volume_level: int)`: Unmutes or changes volume (1 to 10).
* `issue_provisional_settlement(merchant_id: str, amount: float, reason: str)`: Releases instant advance credit under strict guardrails.
* `dispatch_field_replacement(merchant_id: str, device_id: str, reason: str)`: Creates urgent ticket for local Paytm field service rep.

#### 3. Escalation Tools (Human-AI Collaboration)
* `escalate_to_human_ops(merchant_id: str, urgency: str, summary: str, suggested_action: str)`: Places the case in the Human Teammate Queue with complete context so the human doesn't have to start from scratch.

### 5.2 Deterministic Safety Guardrails
The agent is prohibited from taking arbitrary actions by a strict deterministic policy layer:
1. **Financial Ceiling:** Provisional credit cannot exceed ₹2,000 per merchant per day.
2. **Action Frequency:** Remote soundbox replay can be attempted at most 3 times for the same order.
3. **Mandatory Human Escalation:** Any complaint involving disputed amounts > ₹5,000, detected fraud flags, or physical device replacement must be routed to the Human Ops queue with `pending_human_approval=True`.

---

## 6. Hackathon Presentation & Pitch Strategy (PPT Guide)

Based on the official PPT guidelines in `docs/paytm_ai_hackathon.md`:

| Slide | Title | Content to Present |
|---|---|---|
| **01** | **Title Slide** | **Paytm MerchantOps AI — The Autonomous Merchant Teammate**<br>*Track 3: Autonomous AI Teammates (Hyderabad Edition)* |
| **02** | **Problem Statement** | 40M+ merchants face peak-hour operational disruptions (Soundbox silent, pending UPI payments, settlement hold-ups). Existing IVR/chatbots are passive FAQ readers; human support is overwhelmed. |
| **03** | **Proposed Solution** | An AI teammate that **diagnoses, acts across Paytm ledgers & IoT devices, and resolves issues end-to-end** in <15 seconds, escalating only true edge cases with structured dossiers. |
| **04** | **Technology Stack** | • Intelligence: Gemini 2.0 / 1.5 Flash (Function Calling)<br>• Backend: Python, FastAPI, SQLAlchemy, SQLite<br>• Frontend: React 18, Vite, Tailwind CSS, Lucide icons<br>• Architecture: Deterministic Guardrail Layer + Tool Calling Loop + Mock Paytm IoT & Ledger APIs |
| **05** | **USP (Unique Value)** | • **Actions, Not Just Answers:** Actually triggers soundbox replays & adjustments.<br>• **Safety by Design:** LLM proposes, deterministic guardrails authorize.<br>• **True Teammate Model:** Works side-by-side with human ops through structured handoffs. |
| **06** | **Impact & Metrics** | • **80%+ Autonomous Resolution:** Routine Soundbox and transaction checks resolved without human intervention.<br>• **Resolution Time:** Reduced from 4-24 hours to **<15 seconds**.<br>• **Zero Merchant Churn:** Instant trust restoration during peak business hours. |
| **07** | **Business Model** | • Lowers Paytm merchant support OpEx by 60%.<br>• Retains high-value merchants who churn due to payment uncertainty.<br>• Premium "Paytm Gold Priority Support" tier for enterprise merchants. |

---

## 7. 12-Hour Hackathon Execution Schedule

```
  [0-2h] Setup & Models    ──>  [2-5h] Tools & Agent     ──>  [5-8h] Frontend Cockpit  ──>  [8-10h] End-to-End Demo  ──>  [10-12h] Pitch & PPT
  - SQLite schema               - Paytm mock APIs              - Dual-pane layout             - 3 live scenarios             - Slide deck ready
  - Seed 10 merchants           - Diagnostic & Action tools    - Soundbox status card         - Error recovery check         - Rehearsal
  - Config & DB models          - Guardrails & Policies        - Human escalation queue       - Audio voice playback
```

* **Hour 0 – 2 (Foundation):** Create Paytm database schema (Merchants, Soundbox devices, Transactions, Support tickets). Seed mock data for 10 realistic Indian merchants.
* **Hour 2 – 5 (Agent Core):** Wire the Gemini tool-calling loop with Paytm diagnostic and action tools (`check_soundbox`, `verify_txn`, `trigger_replay`, `escalate_human`).
* **Hour 5 – 8 (Frontend Cockpit):** Build the split-screen view: Left side = Merchant WhatsApp/Soundbox Mobile simulator; Right side = Internal Paytm Operations Cockpit with live telemetry and human queue.
* **Hour 8 – 10 (End-to-End Integration):** Verify the 3 core live demo workflows with real audio playback and real-time state mutation.
* **Hour 10 – 12 (Pitch Deck & Polish):** Complete the 7-slide pitch deck following hackathon guidelines and rehearse the 3-minute live demo.

---

## 8. Step-by-Step Implementation Action Items

### Step 1: Database Models & Seed Data
* Create `backend/app/models/paytm.py`:
  - `Merchant`: ID, store name, phone, city, daily volume, VIP status.
  - `SoundboxDevice`: Device serial number, SIM operator, signal bars, battery %, volume level, last ping, firmware.
  - `Transaction`: Order ID, merchant ID, amount, UPI RRN, status (`SUCCESS`, `PENDING`, `FAILED`), failure reason.
  - `OpsTicket`: Ticket ID, merchant ID, issue type, priority, status (`AUTONOMOUSLY_RESOLVED`, `ESCALATED_TO_HUMAN`), agent dossier.

### Step 2: Paytm Subsystems Mock Services
* `backend/app/mock_paytm/soundbox_iot_service.py`: Simulates live Soundbox state change (replay audio, unmute, reboot SIM module).
* `backend/app/mock_paytm/core_ledger_service.py`: Simulates transaction queries, bank switch status, and provisional credit releases.

### Step 3: Agent Tool Implementation
* In `backend/app/agent/tools/`, add specialized Paytm tools that hook into the mock services.
* Update `backend/app/agent/prompts.py` with the **Paytm MerchantOps Teammate** persona (empathic, bilingual Hindi/English, rigorous, outcome-focused).

### Step 4: Frontend UI Updates
* Update `frontend/src/` to showcase the **Paytm MerchantOps Cockpit**:
  - A mobile simulator allowing the judges to type or speak like a merchant.
  - A live Soundbox status card that visually shows battery, signal, and speaker animation when an announcement is replayed.
  - A Human Teammate Queue showing cases being resolved in real-time or awaiting approval.

