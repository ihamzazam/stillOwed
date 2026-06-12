# StillOwed — demo site

Static demo site for **StillOwed** (Dead Invoice Rescue): an AI agent that recovers written-off B2B invoices, courteously, in the client's own name. Now onboarding a limited number of pilot clients.

Everything is simulated client-side. No backend, no build step, no tracking. All companies, people, and messages on the site are fictional sample data.

## Pages

- `index.html` — the demo page: hero with early-access email capture, the three-case "Living Case Files" simulation with the agent decision log, the "You be the debtor" guardrail widget, ROI slider, trust strip, FAQ, and intake mock.
- `legal.html` — legal & trust hub with four tabbed documents: Terms of Service, Privacy Policy, Guardrail Register, Compliance. Deep-linkable via `legal.html#terms`, `#privacy`, `#guardrails`, `#compliance`. The Terms and Privacy texts are drafts pending attorney review; open items render as highlighted placeholder tokens.

## Structure

```
index.html          demo page
legal.html          legal & trust pages
assets/
  site.css/.js      demo page styles + simulation engine
  legal.css/.js     legal pages styles + tab/TOC behavior
  brand/            StillOwed logo SVGs (mark, lockup, wordmark, avatar; light/dark)
design/             design source material (not committed — see .gitignore)
```

## Run locally

Any static file server works, e.g.:

```
python -m http.server 8000
```

then open http://localhost:8000/. The site also works on GitHub Pages as-is (serve from the repo root).

&copy; 2026 Frost Peak Ventures LLC, operating as StillOwed.
