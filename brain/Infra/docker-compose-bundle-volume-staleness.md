---
title: Named bundle volume outlives Gemfile changes
tags: [gotcha, docker, rails]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# Named bundle volume outlives Gemfile changes

[[app-scaffold]]'s `docker-compose.yml` mounts a named volume at `/usr/local/bundle` in the `rails` service (so `bundle install` isn't re-run on every container start). Rebuilding the image after adding a gem (`docker compose build rails`) is **not enough** — the named volume still holds the old installed gems and is mounted *over* whatever the fresh image has, so the container boots with the stale gem set and crashes with `Bundler::GemNotFound`.

Fixed by adding `(bundle check || bundle install) &&` to the service's startup command, so a Gemfile change is picked up on next container start without needing `docker compose down -v`. Worth knowing `down -v` (removing volumes) is the blunt fix if the command-based one is ever bypassed.

Related: [[yaml-folded-block-scalar-indentation]] — the multi-line command for this fix has its own gotcha.
