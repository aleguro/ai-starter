---
title: YAML folded block scalar needs uniform indentation
tags: [gotcha, yaml, docker-compose]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# YAML folded block scalar (`>`) needs uniform indentation

In `docker-compose.yml`'s `rails` service `command: >` block, a continuation line indented *deeper* than the first line is treated by YAML as a "more-indented" line inside a folded scalar — its newline is preserved literally instead of being folded into a space. The result: `sh -c "..."` received an actual newline before `&& bin/rails ...`, which `sh` then refused to parse (`Syntax error: "&&" unexpected`).

Fix: keep every continuation line of a `>` block at the exact same indentation as the first line. Verify with `docker compose config` before trusting a multi-line `command:` — it prints exactly what the container will receive.
