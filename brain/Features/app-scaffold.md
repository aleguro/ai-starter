---
title: App Scaffold (Rails API + React)
tags: [feature, scaffold, auth]
created: 2026-11-07
updated: 2026-11-07
status: draft
type: feature
spec: docs/superpowers/specs/2026-11-07-app-scaffold.md
branch: feature/app-scaffold
layers_committed: [spec]
---

# App Scaffold (Rails API + React)

## Summary

Bootstrap the two-stack foundation for the project: a Rails 8.1 API-only backend (MVC, thin controllers delegating to `aleguro/odsl` service objects for business logic, Devise + JWT auth) and a React 19.2 frontend (React Query + Material UI) that consumes it. Ends with a Playwright e2e check of the signup/login flow across both stacks. This is the base every future feature builds on. Everything dockerized with docker compose. 

## Actors

- **Developer** — runs the scaffold, wires the two apps together
- **Registered user** — signs up / logs in through the API via JWT

## Acceptance criteria

- [ ] `apps/rails-app` boots as an API-only Rails 8.1 app with Devise + `devise-jwt` wired for signup/login/logout
- [ ] `apps/react-app` boots as a React 19.2 app with React Query + MUI, has a working login screen talking to the API
- [ ] `docker compose up` boots Rails + Postgres + React together with no host-installed toolchain required
- [ ] A registered user can sign up and log in end-to-end (API ↔ React), verified by Playwright
- [ ] No regressions in the existing suite

## Tasks

### Stage 1: Independent scaffolds
- [ ] **T1.1** — Rails 8.1 API-only app: MVC skeleton, `aleguro/odsl` gem added and wired as the service-object layer for business logic, Devise + devise-jwt installed and configured | Stack: rails | Size: M | Human: 4h
- [ ] **T1.2** — React 19.2 app: Vite/CRA skeleton, React Query provider, MUI theme provider wired | Stack: react | Size: M | Human: 3h
- [ ] **T1.3** — `docker-compose.yml` + per-app Dockerfiles: rails service, postgres service, react service, all dev-mode with volume mounts | Stack: infra | Size: S | Human: 2h

### Stage 2: Auth flow wired end-to-end
- [ ] **T2.1** — Signup/login/logout controllers (thin) delegating to ODSL service objects for user creation, authentication and JWT issuance/revocation (devise-jwt, denylist strategy) | Stack: rails | Size: M | Human: 4h
- [ ] **T2.2** — Login/signup screens (MUI forms) + React Query mutations calling the API, JWT stored and attached to subsequent requests | Stack: react | Size: M | Human: 4h

## Decisions

- [[adr-01-odsl-service-layer]]
- [[adr-02-jwt-revocation-denylist]]
- [[adr-03-dockerized-dev-default]]

## Related

_Wikilinks to [[Architecture/]], [[Codebase/]], [[Database/]] notes this feature touches._
