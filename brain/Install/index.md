# Install

Local setup, required environment variables, and dependencies.

## Prerequisites

Docker (with Compose) — that's it, per [[adr-03-dockerized-dev-default]]. No host-installed Ruby, Node, or Postgres needed for `apps/rails-app` / `apps/react-app`.

## Setup steps

1. Copy `.env.example` → `.env` at the repo root, fill in `DEVISE_JWT_SECRET_KEY` (generate with `cd apps/rails-app && bin/rails secret` — needs a local Ruby, or run it inside a one-off `docker compose run rails bin/rails secret`).
2. `docker compose up` — boots `postgres`, `rails` (runs `bundle install`/`db:prepare` on start if needed), `react`.
3. Rails API: `http://localhost:3000`. React app: `http://localhost:5173`.
4. E2E tests (optional, host-run): `cd tests/e2e && npm install && npx playwright install chromium && npx playwright test` while the compose stack is up.

## Environment variables

- `DEVISE_JWT_SECRET_KEY` — signs/verifies JWTs. Required; no safe default for anything beyond throwaway local dev.
- `REACT_APP_ORIGIN` (rails) — CORS allowed origin, defaults to `http://localhost:5173`.
- `VITE_API_URL` (react) — Rails API base URL, defaults to `http://localhost:3000`.
- `DATABASE_HOST` / `DATABASE_PORT` / `DATABASE_USERNAME` / `DATABASE_PASSWORD` (rails) — only needed when running Rails outside `docker compose` (e.g. host-run specs); see `apps/rails-app/.env.example`.
