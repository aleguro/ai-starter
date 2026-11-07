---
title: $CLAUDE_PROJECT_DIR is not set in every host
tags: [gotcha, hooks, claude-code]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# `$CLAUDE_PROJECT_DIR` is not set in every host

Project hooks in `.claude/settings.json` were written as `cd "$CLAUDE_PROJECT_DIR" && scripts/<name>.sh`. In this session's host (Claude Desktop's Code tab), `$CLAUDE_PROJECT_DIR` is **empty**. `cd ""` is a silent no-op in bash — it doesn't error, it just stays wherever the hook process's cwd already was. The hook then tries to run the *relative* path `scripts/<name>.sh`, which fails to resolve, and since a hook's `onFailure` defaults to `continue`, the whole thing fails with no visible error. Result: every `metric-logger.sh` / `token-estimator.sh` hook silently never ran for an entire session — confirmed by making a real `Read` and a real `bundle exec rspec` call and finding zero new lines in the metrics file afterward.

The one hook that *did* fire correctly the whole time was the `graphify hook-guard` entry, because it uses an absolute path (`/Users/alejandrogurovich/.local/bin/graphify hook-guard search`) with no `cd` and no dependence on `$CLAUDE_PROJECT_DIR`.

**Fix applied:** every project hook command now resolves the repo root itself — `"$(git rev-parse --show-toplevel)/scripts/<name>.sh"` — instead of relying on `$CLAUDE_PROJECT_DIR`. This works from any cwd inside the repo, regardless of whether that env var is populated.

**Rule of thumb:** never write a project hook as `cd "$CLAUDE_PROJECT_DIR" && <relative path>`. Either use `git rev-parse --show-toplevel` to find the root, or an absolute path if one is known ahead of time. Could not verify live in the same session that introduced the fix — hook config appears to load once at session start, so a mid-session edit to `.claude/settings.json` didn't visibly take effect; confirm in a fresh session.
