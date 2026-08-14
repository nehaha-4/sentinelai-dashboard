# SentinelAI-X — Ransomware Detection, Prevention & Negotiation Suite

A ransomware defense dashboard combining real-time entropy-based detection,
file signature analysis, automated prevention, and AI-driven incident
negotiation.

Live demo: https://sentinelai-dashboard-delta.vercel.app

---

## What this project actually does

Every component below is real and independently testable — nothing here
is a mockup with fake numbers. Where a component is a controlled
simulation instead of live production monitoring, that's called out
explicitly, because that distinction matters for evaluating the system
honestly.

### 1. Detection (real)
- **Shannon entropy analysis** — reads the actual byte distribution of an
  uploaded file and computes entropy in bits/byte. Packed, encrypted, or
  compressed files (the typical shape of ransomware payloads) score high
  (7.0–8.0); plain text and structured files score low.
- **File signature detection** — reads magic bytes from the file header to
  identify the real file type (PE executable, ZIP, PDF, ELF, etc.),
  independent of the file extension, which can be spoofed.
- Combining both gives a stronger signal than either alone: a `.txt` file
  that's actually a PE executable with entropy 7.9 is far more suspicious
  than either fact in isolation.

### 2. Live monitoring
- The dashboard includes a background feed that generates synthetic scan
  events every ~3.5 seconds, so the graphs and telemetry table update
  continuously rather than only on manual upload — demonstrating what a
  live detection pipeline looks like end-to-end.
- **This feed is simulated data**, not a live scan of the browser's host
  machine — a website cannot read arbitrary files on your computer, by
  design (browser sandboxing). Real file uploads through the dashboard
  ARE scanned for real, with real entropy and signature results.

### 3. Prevention (real, via a separate local agent)
- `agent.py` is a standalone Python program (not part of the web app) that
  watches a real folder on disk in real time. When it detects a file
  crossing the entropy threshold, it:
  - Identifies and terminates any process holding that file open
  - Moves the file into an isolated quarantine folder
- This is a genuine, testable action — not a status label. A website
  cannot kill OS processes or move files on your computer (browsers don't
  allow this), so real prevention requires a local program, which is
  exactly what `agent.py` is. See `agent.py`'s docstring for setup and
  safe-testing instructions (dry-run mode included).

### 4. AI Negotiation (real)
- `/api/negotiate` is a Vercel serverless function that calls the Claude
  API with the incident context (filename, entropy, threshold, chat
  history) and returns a genuinely generated response — not a canned
  string.
- The API key lives only in Vercel's server-side environment variables,
  never in frontend code.

### 5. Alerts (real)
- Admins can configure a Discord or Slack incoming webhook URL. When a
  file crosses the entropy threshold, the dashboard POSTs a real alert
  message to that channel automatically.

---

## Architecture

```
Your computer
├── Web dashboard (browser, React/Vite)
│     — detection, display, negotiation UI, never touches the filesystem
└── Local agent (agent.py)
      — the only component that takes real prevention action

Web dashboard → Vercel serverless (/api/negotiate) → Claude API
Web dashboard / Local agent → Discord webhook (alerts)
```

The dashboard and the local agent are two separate programs. This is a
deliberate design, not a limitation — it mirrors how real EDR
(endpoint detection & response) tools like CrowdStrike are structured:
a cloud-facing dashboard for visibility, and a local agent for actual
enforcement.

---

## Setup

### Dashboard
```bash
npm install
npm run dev
```

### Environment variables (set in Vercel → Settings → Environment Variables)
| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Powers `/api/negotiate` (real AI negotiation) |
| `ADMIN_PASSWORD` | Powers `/api/verify-admin` (admin console login) |

### Local prevention agent
```bash
pip install watchdog psutil requests
python agent.py
```
Starts in dry-run mode by default (detects and logs, takes no action).
See the docstring at the top of `agent.py` before disabling dry-run.

### Test files
```bash
python generate_test_files.py
```
Generates safe synthetic files (real signatures + controlled entropy,
no functional/malicious content) for exercising detection without
needing real malware samples.

---

## Known limitations

- The live feed on the dashboard is simulated telemetry, not a live scan
  of the visitor's actual computer — explained in-app and above.
- Model retraining (Admin Controls) is a UI simulation; there is no
  actual ML model being retrained in this version.
- The local agent's process-kill logic depends on OS permissions and
  works most reliably on Windows when run with sufficient privileges.
