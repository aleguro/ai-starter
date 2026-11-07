---
title: app-scaffold — AI vs human comparison
tags: [metrics, feature, comparison]
created: 2026-11-07
updated: 2026-11-07
status: active
type: permanent
---

# app-scaffold — AI vs human comparison

[[app-scaffold]] shipped: 5/5 tasks (T1.1-T1.3, T2.1-T2.2), human estimate 17h total. `scripts/metric-logger.sh`'s `session_minutes` (25.3) undercounts actual wall-clock time for this session — it's a narrow internal timer, not a reliable AI-time figure — so the `speed_multiplier` (40.5x) and `cost_saved_usd` below should be read as directional, not as accurate numbers to report externally.

```json
{
  "feature": "app-scaffold",
  "generated_at": "2026-11-07T18:54:55Z",
  "tasks": [
    { "task": "T1.1", "human_estimate": "4h" },
    { "task": "T1.2", "human_estimate": "3h" },
    { "task": "T1.3", "human_estimate": "2h" },
    { "task": "T2.1", "human_estimate": "4h" },
    { "task": "T2.2", "human_estimate": "4h" }
  ],
  "human": {
    "estimated_hours": 17.0,
    "estimated_cost_usd": 1275.0,
    "hourly_rate_usd": 75
  },
  "comparison": {
    "hours_saved": 16.58,
    "speed_multiplier": 40.5,
    "tasks_with_estimates": 5,
    "tasks_without_estimates": 0
  }
}
```

Run `/churn` to visualize this alongside other features.
