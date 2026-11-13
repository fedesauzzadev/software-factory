# Conventions

> Patterns, architecture, and style this project follows. Update when a pattern becomes "the way".

## Architecture
-

## Code style
-

## Patterns in use
(Name → where it lives → why it exists.)

## File ownership
One writer per file prevents collisions the day `max_parallel_agents` rises.

| Path | Written by |
|---|---|
| `brain/nodes/` | the agent running the task (via `triage` / `memory-update`) |
| `brain/index.md` | same agent, as part of `memory-update` |
| `brain/evidence/` | whoever ran the verification |
| `brain/decisions/` | whoever made the decision |
| `brain/conventions.md`, `brain/shared/registry.md` | maintainer / tech lead |

Multi-role orchestrators: extend this table with your roles before raising
parallelism.
