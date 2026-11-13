---
name: Brainloom Plan Project
description: Decompose a whole project idea into ordered vertical slices with dependencies, shared-code candidates, and risks; record them in brain/roadmap.md after explicit user approval. Use when starting a new project (or re-planning one), before building the first slice, or when the user asks for a plan or roadmap.
---

# Plan Project

Input: the WHOLE idea. Output: an approved roadmap of vertical slices.
The plan is a proposal — nothing is recorded until the user approves.

## 1. Understand the idea
- Restate it in 2-5 sentences: what it is, who uses it, what "done" looks like.
- Read `brain/vision.md`; if the idea contradicts it, surface the conflict.

## 2. Ask (blocking, grouped, numbered, with recommendations)
Purpose/scope unknowns, hard constraints, and tech choices ONLY if they gate the
design. Assume the rest; record assumptions as reversible decisions in
`brain/decisions/` and list them in the final proposal.

## 3. Propose slices
A vertical slice is the minimum that crosses ALL layers and works end-to-end.
- **Slice 1 = walking skeleton**: the thinnest possible end-to-end path (one
  input → one output, touching every layer once). It validates the architecture
  and leaves extension points. If it cannot be thin, the architecture is wrong —
  say so and propose a different shape.
- Following slices: one coherent capability each, growing the skeleton. Reuse
  the patterns the skeleton established; never introduce a parallel architecture.
- Order by dependency; flag slices that could run in parallel.

## 4. For each slice, state
- Goal as observable behavior ("after this, the user can ...").
- Nodes it will likely produce (M-sized; trivial S tasks get folded in).
- What it reuses vs what it introduces.
- Its main risk, and what would force a split or reorder.

## 5. Shared code
- Intra-project candidates (used by 2+ slices) → note as CANDIDATES for
  `brain/shared/registry.md` (rule of three still applies — do not pre-abstract).
- Cross-project reusable patterns → registry candidates tagged `cross-project`.

## 6. Risks
Top risks, one mitigation each (spike slice, fallback, cut).

## 7. Fresh eyes before approval (cost-gated)
- Write the full proposal (slices, shared-code candidates, risks) to
  `brain/.staging/proposal.md` — ONE artifact: what the refuter attacks and
  what the user approves must be the same text.
- Spawn the read-only refuter subagent (`brainloom/refuter`, level `strong`)
  ONLY when the proposal earns it — 3+ slices, OR a new architecture/greenfield
  skeleton, OR shared contracts across slices (a wrong assumption compounds).
  Give it the proposal FILE PATH and the code pointers it names — NOT the
  conversation's reasoning. Its fresh context is the point: it attacks
  unstated assumptions, YAGNI, duplication, and readiness (do the named
  files/symbols exist?).
- Small plan (1-2 independent slices, known shape) → run the same four-lens
  pass yourself as a separate step, and SAY the refutation was not
  independent. One spawn per roadmap is cheap; zero is cheaper when the plan
  is small.
- Fold blocking findings into the proposal file; list the findings you reject
  (with why) — never hide them.

## 8. Approval → record
- Point the user at the proposal file (refutation outcome folded in or
  declared); chat carries a summary + the decision ask, never the full dump.
  WAIT for the user's OK (adjust and re-present if not).
- On approval: write the slices into `brain/roadmap.md` (backlog table, slice 1
  as current), the risks, update `brain/index.md`, and delete the staging
  proposal file.

## Routing (levels from `models` in brain/config.yaml)
- Contract/architecture ambiguity while proposing → `brainloom/planner`
  (level `strong`). Sequential spawns (respect `max_parallel_agents`).
- Fresh-eyes refutation of the proposal (§7, when its cost gate opens) →
  `brainloom/refuter` (level `strong`).

## Existing codebase?
This skill plans new or re-planned projects. To map an existing codebase into
the brain, use `adopt` instead.

## Verification
Fixture: tests/fixtures/sample-project
Manual drill (no Task line — §7 records only after explicit user approval,
which a smoke harness cannot grant honestly).
- [ ] Proposal: ordered slices, slice 1 is a walking skeleton, risks with mitigations
- [ ] Refuter pass on the proposal before approval; findings folded or listed
- [ ] Nothing written to brain/roadmap.md before the approval step
