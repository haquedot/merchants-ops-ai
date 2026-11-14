# Paytm MerchantOps AI — Autonomous Merchant Teammate

**An autonomous AI teammate that investigates and resolves merchant operational issues, proves its impact with real controlled experiments instead of guessed numbers, and knows when to act and when to escalate to human teammates.**

Built for **Paytm's Build for India AI Hackathon (Hyderabad Edition — Nov 2026)** — Track 03: Autonomous AI Teammates.

---

## The problem

Revenue and merchant trust loss rarely happens in one clean step. A payment degrades, a Soundbox goes silent during peak shop hours, a settlement is delayed — and most systems either retry blindly or give passive FAQ responses (*"Wait 24-48 hours"*), leaving merchants anxious and business disrupted. 

Paytm MerchantOps AI is built as a true autonomous teammate that understands context, inspects device telemetry, queries core ledgers, and takes corrective actions across systems.

---

## What makes this different

Most customer support bots are passive answering machines. Paytm MerchantOps AI **gets the job done**:

- **Real action across systems, not just chat.** Remotely triggers Soundbox audio chimes, resets connection profiles, issues instant provisional settlement credits, and creates field technician tickets.
- **Real causal measurement, not a reported number.** A genuine randomized control/treatment split is built into the data model itself. It reports a **95% confidence interval on the incremental lift** using the Newcombe method.
- **A genuinely agentic loop, not a fixed script.** The agent decides its own next step, turn by turn, based only on what it has actually observed so far.
- **Self-correcting reasoning.** Before trusting predicted uplift, the agent consults actual observed historical performance.
- **Scarcity-aware, not greedy.** A portfolio allocator ranks all currently open issues and enforces capacity constraints.
- **Operates autonomously + collaborates with humans.** Routine issues are resolved in seconds; complex edge cases are escalated to human teammates with structured investigation dossiers.

---

## Real, verified evidence — not a demo script

| Claim | Evidence |
|---|---|
| Real Paytm Test Mode payment link verified | Payment link generated → captured payment → signature-verified webhook → Outcome recorded, amount matched exactly |
| Genuinely agentic, not scripted | Two structurally different recovery events produce two different tool-call sequences and different turn counts |
| Real incremental measurement | Control 2.62% vs. treated 14.28% recovery rate → 95% CI **[10.6%, 12.6%]** on the incremental lift, excluding zero |
| Fails safely under real conditions | Degrades safely under rate limits without state corruption; subsequent runs observe actual state |
| Portfolio allocation is real, not sorting | Capacity constraints prioritize high-impact cases with auditable skip reasoning |
| Provider-agnostic by design | Runs identically behind Gemini or Groq, selectable by one configuration flag |

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, Python |
| Database | PostgreSQL / SQLite, SQLAlchemy 2.x, Alembic |
| Frontend | React, TypeScript, Vite, TanStack Query, Tailwind CSS |
| AI / LLM | Gemini & Groq — interchangeable via one config flag, stdlib REST, no framework |
| Payments & Subsystems | Paytm Test Mode API, Soundbox Device Cloud & Core Ledger mocks |
| ML / Causal inference | scikit-learn, gradient-boosted uplift modeling |
| Voice | pyttsx3 (local text-to-speech for Hinglish audio chimes) |

---

## Running it locally

```bash
# backend
cd backend
pip install -r requirements.txt
cp .env.example .env   # configure GEMINI_API_KEY, PAYTM_* test-mode keys
uvicorn app.main:app --reload

# frontend
cd frontend
npm install
npm run dev
```

Generate synthetic data:

```bash
python -m app.scripts.generate_data --customers 1000 --seed 42
```

---

## License

Built for Paytm Build for India AI Hackathon 2026.
