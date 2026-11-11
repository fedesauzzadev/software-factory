---
name: Brainloom Triage
description: Classify an incoming task by impact radius before touching code and route it to the right workflow (FIX/S, M, or L). Use when a new task, bug report, feature request, or change request arrives in a project with a brain/ directory.
---

# Triage

Every task starts here. Classify first, then route. Never skip, never code first.

## 1. Load context (cheap reads only)
1. Read `brain/index.md`.
2. Read only the nodes the task plausibly touches (follow links). Do not explore the repo.
3. Read `brain/config.yaml` (commands, limits, models).

## 2. Classify by impact radius (not line count)
Ask, in order:
- **Contract** — does it change a shared API, schema, or domain model that other nodes depend on?
- **Concept** — does it introduce a new concept or extend an existing one?
- **Reversibility** — can it be undone cheaply? (migrations, schemas, public contracts = hard)
- **Blast radius** — how many existing nodes does it affect?
- **Ambiguity** — any blocking unknowns or decisions needed?

| Class | When | Flow |
|-------|------|------|
| **FIX/S** | 0-1 nodes affected, no contracts touched, localizable cause | `small-change` — encapsulated on top of what exists |
| **M** | one new coherent node or vertical slice; contracts may change compatibly | `build-slice` — acceptance criteria first, thin end-to-end |
| **L** | changes contracts, affects several slices, or is irreversible | always plan + explicit user approval BEFORE any code |

Ambiguous between two classes → pick the larger one and say so.

## 3. Blocking questions
If the task or its classification has blocking or irreversible unknowns: ask
NOW, grouped, numbered, short, with a recommended option. Never mid-way.
Assumable unknowns → assume and record as a reversible decision in `brain/decisions/`.

## 4. Route
- **FIX/S** → write acceptance criteria (observable behavior), create the node (`size: S`), implement encapsulated, verify, then `memory-update`.
- **M** → acceptance criteria, create node, build the slice end-to-end, verify, `memory-update`.
- **L** → stop. Present impact (nodes affected, contracts, reversibility) and a slice proposal. Wait for user approval before writing anything.

## 5. Create the node
Instantiate from the kit's node template. `id` = next free `N-XXXX` (check
`brain/nodes/`). Fill the frontmatter; `acceptance_criteria` BEFORE any code.
Node body stays under 40 lines. Register the node in `brain/index.md`.

## 6. Hard limit (anti-monster)
While implementing ANY class: if the diff exceeds `limits.max_diff_lines`
(default 300) or `limits.max_files` (default 8) from `brain/config.yaml` →
STOP, report, propose a split into smaller tasks. Do not continue by inertia.

## No brain?
If `brain/` does not exist in the project, offer to run `init-brain` first.
