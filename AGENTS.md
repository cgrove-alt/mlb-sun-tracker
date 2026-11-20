# Agent instructions

## Local development

This is a Next.js 15 App Router app (The Shadium / MLB Stadium Sun Tracker).

```bash
npm ci
npm run dev
```

The app listens on [http://localhost:3000](http://localhost:3000). No API keys are required to run locally. Weather uses the public Open-Meteo API. Analytics, Sentry, Airtable, and KV are optional and only needed for production features.

## Useful commands

- `npm test` — Jest unit tests
- `npm run type-check` — TypeScript (`tsc --noEmit`)
- `npm run lint` — ESLint
- `npm run test:local` — Playwright visual + a11y checks against the local server

## Cursor Cloud specific instructions

`.cursor/environment.json` installs dependencies with `npm ci` and starts the Next.js dev server in a shared terminal. After boot, smoke-check:

- `GET /` (homepage)
- `GET /stadium/yankees` (canonical stadium page)
- `GET /api/weather/yankees?lat=40.8296&lng=-73.9262` (Open-Meteo proxy)
