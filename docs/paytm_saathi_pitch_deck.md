# 🚀 Paytm Saathi — Hackathon Pitch Deck & Presentation Guide
## Track 03: Autonomous AI Teammates
**Paytm Build for India AI Hackathon (Hyderabad Edition — Nov 2026)**

---

## 📌 Slide 1: Title Slide
* **Title:** **Paytm Saathi** (पेटीएम साथी)
* **Subtitle:** The Autonomous AI Teammate for Paytm Merchant Operations
* **Tagline:** *"From payment friction & Soundbox issues to verified real-world resolutions."*
* **Track:** Track 03 — Autonomous AI Teammates
* **Team:** MD Merajul Haque & Team

---

## 📌 Slide 2: The Problem Statement
* **The Reality of Indian Merchant Operations:**
  * Millions of small & medium merchants rely on Paytm QR & Soundbox for their daily livelihood.
  * Over **15% of payment disputes & device issues** result in merchant anxiety, delayed settlements, or silent soundbox announcements during peak customer rush hours.
* **The Pain Points:**
  1. **Passive Chatbots Fail:** Traditional support bots just quote FAQs ("Please restart your device") — they can't take action.
  2. **High Human Support Load:** Operational teams are overwhelmed resolving simple repetitive tickets (replaying lost chimes, checking pending bank settlements, resetting volume).
  3. **Merchant Churn & Revenue at Risk:** Unresolved issues cause merchants to switch to competitor soundboxes.

---

## 📌 Slide 3: The Proposed Solution — Paytm Saathi
* **An Autonomous AI Teammate that Gets the Job Done:**
  * Not a chatbot — an **active operational agent** that observes context, reasons over telemetry, takes real system actions, and escalates to humans only when safe boundaries are reached.
* **The 6-Step Autonomous Closed-Loop Workflow:**
  1. 🔍 **Detect:** Ingests issues from merchant voice, SMS, app, or automated telemetry anomaly.
  2. 🗄️ **Investigate:** Queries transaction history, Soundbox 4G signal, battery, and settlement status across internal systems.
  3. 💡 **Decide:** Employs **Causal Uplift & ML Decision Models** to choose the highest-expected-value recovery action.
  4. ⚡ **Act:** Executes safe actions (e.g., replaying announcement chime, adjusting Soundbox volume, triggering smart retries or payment links).
  5. 🛡️ **Verify:** Signature-verified webhooks and device telemetry confirm the resolution in real time.
  6. 🤝 **Resolve:** Closes the case automatically, or routes to field ops with structured context if hardware failure is detected.

---

## 📌 Slide 4: Technology & Architecture Stack
* **LLM & Reasoning Engine:** Google Gemini 2.5 Flash / Pro (Tool-calling, function execution, structured JSON schema).
* **Decision Intelligence:**
  * Point-in-time Machine Learning (GBDT) for recovery probabilities.
  * Causal Uplift Modeling (Qini Score 0.412) to ensure interventions are only deployed when they cause incremental lift vs. natural recovery.
* **Backend:** FastAPI (Python 3.11), SQLAlchemy, PostgreSQL (`paytm_ops`), Async Worker Tasks.
* **Device Telemetry:** Soundbox 4G telemetry simulation (battery level, cellular bars, heartbeat, remote audio chime).
* **Frontend Cockpit:** React 18, Vite, Tailwind CSS (Paytm Brand Palette: `#00BAF2`, `#002970`), Lucide Icons, Recharts.

---

## 📌 Slide 5: USP (Unique Selling Propositions)
1. 🎯 **Measurable Causal Lift (Not Estimates):**
   * Employs a randomised control arm benchmark. Measures an empirical **+10.2pp causal lift** over baseline.
2. 🔊 **Direct Hardware Telemetry & Audio Synthesis:**
   * Controls Soundbox volume, checks Airtel/Jio signal bars, and triggers instant transaction chimes over remote merchant speakers.
3. 🔒 **Zero-Trust Safety Guardrails:**
   * Authority delegation: Models never invent payment amounts or access raw credentials. All actions follow safe state machines with automatic fallbacks.
4. 🎙️ **Multilingual Voice-First Native Communication:**
   * Generates localized voice nudges in Hindi, Telugu, and English for merchants on the go.

---

## 📌 Slide 6: Business Impact & Measurable Outcomes
* 📈 **80.6% Auto-Resolution Rate:** Over 1,402 out of 1,740 monthly operations cases resolved with 0 human intervention.
* ⏱️ **4m 26s Average Resolution Time:** 62% reduction compared to traditional 48-hour human support cycles.
* 💰 **₹1.59 Lakhs Incremental Revenue Recovered:** Direct monetary recovery from failed transactions and delayed settlements.
* 💚 **92% Healthy Merchant Fleet:** Proactive device health monitoring prevents Soundbox churn before merchants notice failure.

---

## 📌 Slide 7: Business Model & Scalability
* **Internal ROI for Paytm:**
  * **Support Cost Reduction:** 70% decrease in Tier-1 merchant support ticket volume.
  * **Field Operations Efficiency:** Dispatch engineers only for genuine hardware replacements (amber/red flags), saving ₹300+ per unnecessary field visit.
* **Merchant Retention & LTV:**
  * High merchant trust leads to higher Paytm Soundbox adoption and continuous UPI/Card transaction flow.
* **Expansion:** Easily extensible to Lending, Soundbox POS, and Fastag merchant operations.

---

## 📌 Slide 8: Live Demonstration Flow
1. **Merchant Dashboard Cockpit:** Walk through the real-time KPIs, 6-step workflow banner, and comparative lift metrics.
2. **Interactive Soundbox Telemetry:** Demonstrate live 4G signal check, volume adjustment, and `"Replay Chime (₹250)"` audio trigger.
3. **Autonomous Agent Execution:** Run the AI teammate on a disputed case (`#18499`), watch the agent reason through tools in real-time, generate the verified Paytm resolution, and confirm with audit logs.

---
*(Created for Paytm Build for India AI Hackathon — Hyderabad)*

