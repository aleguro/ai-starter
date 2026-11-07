---
title: ADR-03 Dockerized local dev by default
tags: [decision, infra, docker]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# ADR-03: Dockerized local dev by default

**Date:** 2026-11-07
**Status:** accepted

## Context

[[app-scaffold]] spans two stacks (Rails + React) plus Postgres. Per the project owner's standing preference, new projects default to `docker-compose` for local dev rather than host-installed language toolchains or databases.

## Decision

T1.3 adds `docker-compose.yml` with one service per piece (rails, react, postgres), each with dev-mode volume mounts for live reload. Every other task in this feature (T1.1, T1.2, T2.1, T2.2) is implemented and tested running inside this compose stack, not against a host-installed Ruby/Node/Postgres.

## Consequences

Easier: `docker compose up` is the one onboarding step; no host toolchain version drift between contributors. Harder: every task's dev loop goes through container rebuild/restart instead of a bare host process — slower iteration unless volume mounts are set up correctly in T1.3, so that task gates everything after it.
