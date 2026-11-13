---
name: Brainloom Build Slice
description: Implement one vertical slice end-to-end from the approved roadmap — decompose into nodes, write acceptance criteria before coding, attack them with a fresh-eyes refuter, build thin through all layers, verify functionally, and update the brain. Use when the roadmap's current slice is approved to build, or when triage routes an M-sized task.
---

# Build Slice

One slice at a time, end-to-end, thin. Triage routes M tasks here; L tasks
arrive only after an approved plan.

## 1. Load
- `brain/index.md`, then the current slice from `brain/roadmap.md`.
- Nodes that slice touches; `brain/shared/registry.md` and
  `brain/conventions.md` before writing anything new.
- Large or unfamiliar code area in the slice? Send `brainloom/scout`
  (level `fast` from `models` in config) to pre-read and summarize with
  pointers before you read code yourself. Respect `max_parallel_agents`.

## 2. Decompose
- Break the slice into nodes (M each; fold trivial S tasks into a node).
- Create node files (next free `N-XXXX`) with `acceptance_criteria` BEFORE any
  code — observable behavior per node. All nodes of the slice share its `slice:`
  value. Register them in `brain/index.md`.

## 3. Fresh eyes on the criteria (cost-gated)
- Spawn the read-only refuter subagent (`brainloom/refuter`, level `balanced`)
  ONLY when the slice earns it — 2+ nodes (criteria interlock, a wrong
  assumption compounds), OR the slice introduces a new architecture / walking
  skeleton, OR any node touches a shared contract. Give it the node files
  (criteria) and the code pointers they name — NOT the conversation.
- Single-node slice with local criteria → run the same four-lens pass
  (assumptions, YAGNI, reuse & placement, readiness) yourself as a separate
  step, and SAY the refutation was not independent. Cheap, still catches
  vague criteria.
- No subagent capability in the harness? Same fallback: self-run, declare it.
- Blocking findings → fix the criteria now: cheap here, expensive after
  implementation. Findings you reject get listed in the close report, not
  hidden.

## 4. Per node: thin vertical
- Implement the minimum that satisfies the acceptance criteria across ALL layers.
- Walking skeleton (first slice): thinnest end-to-end path; leave explicit
  extension points instead of building options "for later".
- Reuse what registry/conventions already offer; new duplication candidate
  (2nd occurrence)? Registry candidate, no abstraction.

## 5. Stop conditions
- Diff beyond `limits` in `brain/config.yaml` → stop, report, propose a split.
- The node needs a contract change affecting other slices → stop; that is L:
  plan + explicit user approval first.
- Blocking ambiguity → ask now (grouped, numbered), never mid-way.

## 6. Per node: verify for real
- Run project tests (`commands.test` in config); add tests when a harness exists.
- Functional check: actually run the thing (`commands.run` or directly) against
  each acceptance criterion.
- Evidence summary → `brain/evidence/`; fill the node's `verification` and
  declare `level`. Independent verification (the `verify` skill, incl. the
  refutation subagent) earns `status: verified` — without it the node stays
  `implemented`. Run it ONCE per slice: ONE verifier spawn with ALL the
  slice's nodes (criteria + evidence in a single prompt), never one spawn per
  node. Human gates (commit/deploy) later promote it to `shipped`.

## 7. Close the slice
- All nodes verified → update `brain/roadmap.md` (slice done, next current),
  `brain/index.md`, and `brain/conventions.md` if a new pattern emerged.
- Apply `memory-update` discipline: links, registry, decisions.
- Report: what was built, evidence, assumptions made, and the next slice proposal.

## Verification
Fixture: tests/fixtures/sample-project
Task: The roadmap current slice is S1 (extend the walking skeleton): greet must be callable without arguments, defaulting the name to (world). Build the slice per the skill, non-interactive.
- [ ] Slice decomposed into node(s) with acceptance criteria before any code
- [ ] Thin implementation in app.js
- [ ] Node verified with evidence; roadmap and index updated on close

expect: file brain/nodes/N-0004.md
expect: grep app.js "world"
expect: grep brain/nodes/N-0004.md "status: verified"
expect: valid brain
