# Database

Schema, relationships, indexes, and migration notes.

## Schema overview

`apps/rails-app`, Postgres. Introduced by [[app-scaffold]].

## Key tables / collections

- `users` — Devise-authenticatable (`email`, `encrypted_password`, `name`). No `jti` column — see Migration notes.
- `jwt_denylists` — `jti` + `exp` per revoked token. Backs the Denylist strategy in [[adr-02-jwt-revocation-denylist]].
- `odsl_execution_contexts` / `odsl_step_records` — audit trail for `odsl` service objects (unused by `Auth::SignupService`/`Auth::LoginService` so far — they don't pass an idempotency `key`, so no rows are written yet; the tables exist for when a service needs it).

## Migration notes

`users.jti` was added in `AddJtiToUsers` (T1.1) following a generic devise-jwt guide, then removed in `RemoveJtiFromUsers` (qa layer) once e2e testing showed its unique index broke signup for every user after the first — the Denylist revocation strategy never reads that column (only the JTIMatcher strategy would). See [[adr-02-jwt-revocation-denylist]]'s Correction section.
