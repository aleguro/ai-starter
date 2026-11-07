# Spec: app-scaffold

**Date:** 2026-11-07
**Branch:** feature/app-scaffold
**Stack:** rails | react
**Ticket:** brain/Features/app-scaffold.md

---

## Actors

| Actor | Role |
|-------|------|
| Developer | Bootstraps and wires the two apps |
| Registered user | Signs up / logs in through the API via JWT |

---

## Use Cases

### UC-01: Rails API-only app boots with auth + service-layer foundation
- **Actor:** Developer
- **Precondition:** Empty `apps/rails-app` directory
- **Main flow:**
  1. Developer generates a Rails 8.1 API-only app (`--api`) under `apps/rails-app`
  2. Developer adds the `aleguro/odsl` gem to the Gemfile and runs its generator/setup — ODSL provides the business-logic layer: controllers stay thin and delegate to DSL-defined service objects instead of holding logic themselves
  3. Developer installs `devise` and `devise-jwt`, configures a `User` model and JWT revocation strategy
  4. App boots and responds `200` on a health endpoint
- **Alternative flows:**
  - 2a. `aleguro/odsl` gem is private/unavailable → stop and surface the install error, do not stub it out silently
- **Postcondition:** Rails app boots, migrations run, Devise + JWT configured, ODSL wired as the service layer convention, no routes beyond health + auth yet

### UC-02: React app boots with data + UI foundation
- **Actor:** Developer
- **Precondition:** Empty `apps/react-app` directory
- **Main flow:**
  1. Developer scaffolds a React 19.2 app under `apps/react-app`
  2. Developer installs and wires `@tanstack/react-query` (QueryClientProvider at root)
  3. Developer installs and wires Material UI (ThemeProvider + CssBaseline at root)
  4. App boots and renders a placeholder home screen
- **Postcondition:** React app boots with React Query + MUI providers in place, no business screens yet

### UC-03: Developer boots the whole stack with one command
- **Actor:** Developer
- **Precondition:** Docker is installed; nothing else is required on the host (no local Ruby/Node/Postgres install)
- **Main flow:**
  1. Developer runs `docker compose up`
  2. Postgres, Rails API, and React app containers start, each with dev-mode volume mounts for live reload
  3. Rails app connects to the Postgres service and runs pending migrations
  4. React app's dev server is reachable on its mapped port and proxies/calls the Rails service by its compose service name
- **Postcondition:** The full stack is running locally without any host-installed language toolchain or database

### UC-04: Registered user signs up and logs in end-to-end
- **Actor:** Registered user
- **Precondition:** Both apps from UC-01/UC-02 are running (via UC-03's docker compose stack); API reachable from the React app's configured base URL
- **Main flow:**
  1. User opens the React app's signup screen and submits name/email/password
  2. React Query mutation calls `POST /signup` on the Rails API
  3. Controller delegates to an ODSL signup service object, which creates the user via Devise and issues a JWT (devise-jwt); controller returns the service's result
  4. React app stores the JWT and redirects to a logged-in home screen
  5. User logs out and logs back in via `POST /login` (controller → ODSL login service), same JWT flow
- **Alternative flows:**
  - 1a. Duplicate email → API returns 422 with validation errors → form shows them inline
  - 3a. Wrong credentials on login → API returns 401 → form shows a generic auth error
- **Postcondition:** User has a valid session (JWT held client-side, attached as `Authorization: Bearer` on subsequent requests)

---

## Stages and Tasks

### Stage 1: Independent scaffolds (minimum viable)

- [ ] **T1.1** — Rails 8.1 API-only app: MVC skeleton, `aleguro/odsl` gem added and wired as the service-object layer for business logic, Devise + devise-jwt installed and configured, health endpoint | Stack: rails | Size: M | Human: 4h
- [ ] **T1.2** — React 19.2 app: scaffold, React Query provider, MUI theme provider, placeholder home screen | Stack: react | Size: M | Human: 3h
- [ ] **T1.3** — `docker-compose.yml` + Dockerfiles for rails/react/postgres services, dev-mode volume mounts, env wiring between services | Stack: infra | Size: S | Human: 2h

### Stage 2: Auth flow wired end-to-end (complete the flow)

- [ ] **T2.1** — Signup/login/logout controllers (thin) delegating to ODSL service objects for user creation, authentication and JWT issuance/revocation (devise-jwt, denylist strategy) | Stack: rails | Size: M | Human: 4h
- [ ] **T2.2** — Signup/login screens (MUI forms + validation), React Query mutations, JWT storage + auth header attached to the API client | Stack: react | Size: M | Human: 4h

---

## Acceptance Criteria

- [ ] UC-01, UC-02, UC-03, UC-04 work end-to-end in local dev
- [ ] Tests cover main flow + alternative flows (duplicate email, bad credentials) for each UC
- [ ] No regressions in the existing suite
- [ ] Metrics within range (see Step 5 of spec-driven-development)

---

## Design Decisions

- JWT revocation strategy: denylist (devise-jwt's `Devise::JWT::RevocationStrategies::Denylist`) — simplest strategy, needs one `jwt_denylist` table, sufficient for a scaffold with no refresh-token rotation yet.
- `aleguro/odsl` is a service-object layer: business logic is defined as Ruby-DSL service objects, and controllers stay thin, only orchestrating request/response and delegating the actual work (user creation, authentication, JWT issuance) to ODSL services. Confirmed at the human checkpoint — T1.1/T2.1 now wire ODSL as this project's standard convention for where business logic lives, not just a Gemfile addition.
- Dockerized by default, no host language toolchain: per the user's standing preference, local dev runs through `docker-compose.yml` (rails + react + postgres services) instead of host-installed Ruby/Node/Postgres. T1.3 owns this; T1.1/T1.2/T2.1/T2.2 are implemented and tested running inside the compose stack.
- No mockup produced for this spec: UC-04's screens are plain signup/login forms with no distinctive visual design called for: `frontend-design` + `docs/designs/` skipped per Step 3's trigger.
