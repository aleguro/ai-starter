---
title: ADR-01 ODSL as the service-object layer
tags: [decision, rails, architecture]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# ADR-01: ODSL as the service-object layer

**Date:** 2026-11-07
**Status:** accepted

## Context

[[app-scaffold]] needs a place for business logic (user signup, authentication) that isn't Rails controllers or models directly. The `aleguro/odsl` gem is a Ruby-DSL-based service-object layer, added to the Rails app in T1.1.

## Decision

Controllers in `apps/rails-app` stay thin: they parse the request, call into an ODSL service object for the actual business logic, and shape the response from the service's result. Signup/login/logout (T2.1) are the first services built this way — this becomes the standard convention for business logic in this app going forward, not a one-off for auth.

## Consequences

Easier: logic is testable in isolation from HTTP, controllers stay small and uniform. Harder: every new piece of business logic needs an ODSL service defined first — no "quick logic in the controller" escape hatch. See [[Codebase/index]] once T1.1/T2.1 land for the concrete service object conventions (naming, folder, testing pattern).
