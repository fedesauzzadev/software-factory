# AGENTS.md — brainloom kit (this repo)

> This repo SHIPS the brainloom kit. It is held to the kit's own standard:
> small verified steps, real memory, no monsters.

## Non-negotiable: TODO se verifica

Every claim of "done / works / verified / passes" must be backed by a command
that was actually executed and its observed result, shown in the reply.
"Should work", "probably passes", "CI will run it" = NOT verified = NOT done.
If something cannot be verified (no infra, no credentials), say so explicitly
and mark the work accordingly — never present it as done.

## Kit development rules

1. Before versioning: `node scripts/smoke.mjs` (structural) must pass, and any
   skill/flow the change touches gets its `--agent` contract run (real harness)
   or stays unverified.
2. CI steps are bash-pinned; verify each `run:` command locally under bash
   (`git bash` works) exactly as written before pushing a workflow change.
   Remotes: `origin` (local bare) and `github` (fedesauzzadev/brainloom,
   public — GitHub Actions runs the CI there for real).
3. Follow Keep-a-Changelog + SemVer; additive brain-format fields need no
   schema bump (precedent: `verify:` 0.3.0, `verification.level` 0.4.0);
   breaking changes ship a migration in the same change.
4. Repo layout: `/core` (tool-agnostic content), `/adapters/opencode`,
   `/scripts` (portable Node stdlib-only .mjs), `/tests` (fixtures + fake
   agent). Any `.ps1`/`.cmd`/`.bat` must be ASCII-only or UTF-8 BOM.
5. This repo dogfoods the kit: `brain/` exists since 0.7.1 (clean start — D-0001).
   THIS file keeps the kit-dev rules; work state (nodes, decisions, evidence)
   lives in `brain/`. Small refined edits take the Fast-Path and touch no brain
   state; real M/L work gets nodes with criteria, per the kit's own triage.
6. `core/templates/AGENTS.md` is the static prefix every instance sends on
   every turn. Provider-side prompt caching only pays while that prefix is
   byte-identical: keep stable sections stable (edit in place, never
   reorder), append new rules at a section end, and keep volatile
   per-project content at the file's end. Plugin notices append to the END
   of the prompt, never the front.

---

<!-- brainloom instance block (appended by init-brain; everything above is kit-dev rules) -->

Guiding principle: **small verified steps, real memory, no monsters.**

## Fast-Path (zero-overhead routing)
Before triage: one deterministic check, zero file reads.

A task is **refined** when ALL hold:
- it names its target exactly (file(s), symbol, or pattern);
- it states the expected behavior (acceptance is implicit in the request);
- it touches no shared contract and has no blocking unknowns.

Refined → skip triage and skip the index entirely. Read ONLY the named
files (path injection — never `brain/index.md`), make the minimal diff,
verify with the project's real command, then close via `memory-update`
(one node, `size: S`, criteria = the stated behavior). Any doubt → not
refined; full triage below.

Fast-Path reply = data only: files touched, one-line diff summary,
verification command + observed result. No preamble, no narration —
every extra sentence is paid output tokens.

## Reading order (token economy — full path only)
1. `brain/index.md` — always first. Fast-Path never reads it.
2. Only the nodes the task plausibly touches (follow links from the index).
3. `brain/shared/registry.md` before writing anything potentially shared.
4. `brain/conventions.md` for patterns and style.
5. Only then the specific code a node points to. Never explore the repo blind.

## Every non-refined task goes through triage
Any task that is not refined — feature, fix, refactor, change question —
is classified first (FIX/S, M, L by impact radius) and routed by the
`triage` skill. Never skip it.

## Done means
1. Acceptance criteria written BEFORE coding (observable behavior).
2. Project tests pass (`brain/config.yaml` → `commands.test`).
3. Functional verification: the thing actually ran (`commands.run`); evidence under `brain/evidence/`.
4. Independent verification by a read-only verifier that tries to REFUTE it.
5. Brain updated via `memory-update`. No node update → not done.

That state is **agent-done** (`status: verified`) — it requires a filled
`verification` block (command + result + evidence) and a declared depth in
`verification.level`: `full` = tests + functional run (product code);
`smoke` = structure validated, behavior spot-checked — orchestration/spec
deltas only. No evidence → the node
stops at `implemented`; never write `verified`/`fixed` on unrun code.
Human-gated steps (commit, deploy, merge) are **shipped** — they never gate
local verification, and local verification never waits on them.

## Model routing (levels from `models` in brain/config.yaml — never hardcode a provider)
Route by task, not habit. Levels are abstract; each project maps them to its
provider's concrete models (see the AGENTS instance file or brain/config.yaml).

| Task | Level | Why |
|---|---|---|
| L-class planning, architecture, contract design, ambiguous triage | `strong` | judgment over irreversibles |
| Refutation verdicts on complex nodes; final review of large diffs | `strong` | a wrong "pass" here costs the most |
| Default build work; `verify` on product code; semantic `reconcile` calls | `balanced` | quality work, bounded scope |
| Reading, searching, summarizing code (scout); mechanical edits — pointers, index rows, evidence formatting | `fast` | volume, no judgment |
| Re-running checks; mechanical `reconcile` fixes; formatting artifacts | `fast` | deterministic |

Rules:
- Reading, writing mechanical artifacts, executing checks → `fast`.
  Thinking, deciding, refuting → `strong`. Between the two → `balanced`.
- Two levels look equal? Take the cheaper one first; escalate only on a
  failed or ambiguous result. Escalation is one spawn; over-provisioning
  every step is the expensive habit.
- `models` empty in config? Use the harness default and SAY SO — never
  guess a model id.

## Limits
If the diff exceeds `limits` in `brain/config.yaml` (default: 300 lines / 8 files):
stop, report, propose a split. Never continue by inertia.

## Questions
Blocking or irreversible → ask at task start, grouped, numbered, with a
recommendation. Everything else: assume, record in `brain/decisions/`, surface
in the final summary.

## Update check
On session start, run the kit's `check-update` script (or heed the notice
plugin). One line, never blocks. Opt-out: `update_check.enabled` in `brain/config.yaml`.

## Long artifacts (anti chat-dump)
Proposals, drafts, refutation reports, and multi-section plans are FILES
(under `brain/` or the repo) — never dumped into chat. Chat gets a short
pointer plus the decision ask. Long dumps pollute context for every later turn.
