---
title: ADR-02 JWT revocation via denylist
tags: [decision, rails, auth]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# ADR-02: JWT revocation via denylist

**Date:** 2026-11-07
**Status:** accepted

## Context

[[app-scaffold]] needs `devise-jwt` to invalidate a token on logout (T2.1). `devise-jwt` ships three revocation strategies: Denylist, AllowList, and Null.

## Decision

Use `Devise::JWT::RevocationStrategies::Denylist` — one `jwt_denylist` table, revoked-on-logout semantics, no refresh-token rotation. Simplest strategy that satisfies UC-04 (signup/login/logout) without over-building for a scaffold.

## Consequences

Easier: minimal schema (one table), straightforward to reason about. Harder: every authenticated request pays a denylist lookup; if the project later needs refresh-token rotation or multi-device session management, this strategy will need to be revisited — track that as a future ADR when it comes up, not now.
