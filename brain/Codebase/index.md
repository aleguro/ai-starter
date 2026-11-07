# Codebase

Conventions, patterns, key modules, and known gotchas.

## Conventions

_Naming, file structure, coding style decisions._

## Key modules

_Most important entry points and what they do._

## Gotchas

- [[devise-jwt-session-store-false]] — `sign_in` must pass `store: false` or JWT revocation silently doesn't work
- [[odsl-install-generator-rails-8-1-bug]] — `odsl:install` generator crashes on Rails 8.1, worked around by hand-writing the migration
