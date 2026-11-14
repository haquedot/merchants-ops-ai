Rayan, I inspected the actual repository and its README. **Reclaim is much more than a payment-retry chatbot.** Its main idea is to decide which failed payments are worth recovering, take a controlled action, and verify whether that action actually recovered money.

Repository: [Reclaim – GitHub source code](https://github.com/aadhi590/razorpay?utm_source=chatgpt.com)

It was built for Razorpay AI Buildathon 2026, Track 03: AI Revenue Recovery.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



# **1. What Reclaim actually does**

Imagine a customer tries to pay ₹499, but the payment fails.

A normal system might automatically retry the payment.

Reclaim does something smarter:

1. Detects the failed payment.
2. Checks why it failed.
3. Calculates the chance of recovery.
4. Decides whether an intervention is worthwhile.
5. Checks whether the action is allowed.
6. Creates a payment link if appropriate.
7. Waits for actual payment confirmation.
8. Records whether the money was recovered.

**The important difference:** Creating a payment link does not mean the payment has succeeded. Reclaim only counts a recovery after receiving a verified payment webhook.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



# **2. Its architecture in simple terms**

### **Failed Payment**

New recovery event

**Detection & Analysis**

Understand payment failure and customer context

### **AI Recovery Agent**

Gemini / Groq · Tool calling

**ML Intelligence**

Recovery probability + incremental uplift

### **Safety / Policy Engine**

Checks eligibility, limits and permissions

Recover

Stop

Escalate

**Verified Outcome + Audit Trail**

Signed payment webhook and database records

The key design decision is that **Gemini suggests actions, but deterministic backend rules control whether those actions are allowed.**&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



# **3. What features does it have?**

Here is the complete feature breakdown from its README.

| Feature              | What it does                                                  |
| -------------------- | ------------------------------------------------------------- |
| Payment detection    | Finds failed payments and subscriptions                       |
| AI recovery agent    | Decides the next action using Gemini                          |
| Recovery prediction  | Estimates the probability of recovery                         |
| Uplift prediction    | Estimates whether an intervention actually makes a difference |
| Safety rules         | Prevents unauthorized or excessive actions                    |
| Payment link         | Creates Razorpay Test Mode payment links                      |
| Webhook verification | Confirms whether payment was actually received                |
| Portfolio allocator  | Selects which cases deserve limited recovery resources        |
| Autonomous scheduler | Runs recovery checks automatically                            |
| Analytics            | Measures actual recovery and incremental improvement          |
| Audit trail          | Records every decision and action                             |
| Hinglish voice       | Generates spoken customer messages                            |

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub

## **4. What technology did they use?**

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React + TypeScript + Vite |
| Backend  | Python + FastAPI          |
| Database | PostgreSQL                |
| AI       | Gemini + Groq             |
| ML       | Scikit-learn              |
| Payment  | Razorpay Test Mode        |
| Voice    | pyttsx3                   |

Interestingly, they did not use LangChain or LangGraph. They implemented their own tool-calling loop.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



## **5. What makes Reclaim impressive?**

Three things stand out.

**A. AI doesn't control money directly**

Gemini recommends an action. Backend rules check whether that action is allowed.

**B. It verifies the result**

Creating a payment link is not considered successful recovery. A verified webhook must confirm the payment.

**C. It measures actual impact**

The README reports:

# **14.28%**

Treatment recovery rate

# **2.62%**

Control recovery rate

These are figures reported by the repository author, not independently audited results.&#x20;

[image](https://www.google.com/s2/favicons?domain=https://github.com\&sz=32)

GitHub



# **6. Let's build our Paytm version**

I don't recommend copying Reclaim exactly.

Reclaim focuses on revenue recovery. Paytm Track 3 asks for an AI teammate that can complete customer-service or sales workflows.

Let's adapt its strongest engineering ideas.

Our proposed project

# **Paytm MerchantOps AI**

**An autonomous AI teammate that investigates and resolves merchant operational issues.**

[Paytm: Secure & Fast UPI Payments, Recharge Mobile & Pay Bills](https://images.openai.com/static-rsc-4/0SdOIVENOrW2mHM5-EYFOXliQzvVC-NUzuUlX6lFGpi-PL3i2V_evoB99GK8ReEQMryS_uluBXsIi4jHsgspAJzjTefEOaSkvvcDdKDwnxLtNwzCuMMTouXmmOYaWj0oPqy-fagh1BWQbjSlQVlNrU9pT4UzFEwL-B-gWQuIsjU?purpose=inline)

[paytm.com](https://paytm.com/?utm_source=chatgpt.com)

### **Three workflows**

**1. Payment issue resolution**

- Detect missing or pending payments.
- Investigate transaction records.
- Explain the cause.
- Create and track support tickets.

**2. Soundbox troubleshooting**

- Ask merchants about their problem.
- Run simulated device diagnostics.
- Identify possible causes.
- Recommend or initiate permitted support actions.

**3. Autonomous customer support**

- Understand complaints.
- Prioritize cases.
- Resolve routine cases.
- Escalate complex cases to human employees.

### **What we will take from Reclaim**

| Reclaim feature           | Our Paytm adaptation                         |
| ------------------------- | -------------------------------------------- |
| Autonomous recovery agent | Autonomous merchant support agent            |
| Recovery scoring          | Issue priority scoring                       |
| Deterministic guardrails  | Action permission checks                     |
| Razorpay payment link     | Paytm-style simulated payment/support action |
| Verified webhook          | Verified backend operation result            |
| Portfolio allocator       | Support case prioritization                  |
| Autonomous scheduler      | Automatic issue monitoring                   |
| Audit trail               | Agent activity history                       |

### **Our technology stack**

- Python + FastAPI
- React + Vite
- Gemini API
- Sarvam AI (Hindi/Telugu voice)
- SQLite
- Scikit-learn (only if time permits)

## **7. How we will build it in 12 hours**

| Time        | Target                    |
| ----------- | ------------------------- |
| 0–1 hour    | Architecture and database |
| 1–3 hours   | Backend and mock data     |
| 3–5 hours   | Gemini agent and tools    |
| 5–7 hours   | React dashboard           |
| 7–9 hours   | Integration and voice     |
| 9–11 hours  | Testing and debugging     |
| 11–12 hours | Demo and presentation     |

## **8. Let's start with the first decision**

I want us to build one complete workflow first, then add the other features.

**Which workflow should we implement first?**

**Payment issue resolution**

Investigate failed and pending payments, create tickets and resolve cases.

**Soundbox troubleshooting**

Diagnose merchant device problems and initiate support.

**Combined merchant support**

Handle payment and Soundbox complaints through one agent.

**How should we demonstrate actions?**

Mock Paytm APIs and simulated actions (recommended)

Authorized sandbox APIs where available

Let's build the project

**My recommendation:** Start with combined merchant support using simulated APIs. But make payment investigation the first fully working workflow.

We'll build the actual code step by step, not just keep generating prompts.