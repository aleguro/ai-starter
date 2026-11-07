---
title: devise-jwt requires store false on sign_in
tags: [gotcha, rails, auth, security]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# devise-jwt requires `store: false` on sign_in

In [[app-scaffold]], API-only Rails strips session middleware by default, but Warden (under Devise) still touches `request.session` internally, raising `ActionDispatch::Request::Session::DisabledSessionError` on `sign_in`. The fix — re-enabling a cookie session store (see [[adr-01-odsl-service-layer]] context, `apps/rails-app/config/application.rb`) — reintroduces a worse problem: Warden then persists the signed-in user **in that session cookie**, so any later request authenticates from the cookie and silently bypasses JWT validation entirely — including a revoked/denylisted token. `GET /me` kept returning `200` with a logged-out, revoked JWT until this was caught, because the cookie — not the JWT — was what Warden actually checked.

The fix is documented in devise-jwt's own README (security caveats section): call `sign_in(user, store: false)` in every custom controller action that signs a user in (`Users::RegistrationsController#create`, `Users::SessionsController#create`). This tells Warden not to persist the user into the session, so the JWT strategy is the only thing that can authenticate subsequent requests.

**Rule of thumb:** in any Rails API-only app with Devise + devise-jwt, every `sign_in` call must pass `store: false`. Without it, JWT revocation (logout, denylist) silently doesn't work, and it won't show up as an error — only as a security hole where "logged out" tokens keep working.
