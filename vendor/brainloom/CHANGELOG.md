# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).
Entries that change the brain format, config, or skill contracts are marked **[BREAKING]**.

## [Unreleased]

### Added
- The kit repo now dogfoods the kit itself: `brain/` initialized (clean start, no adopt mapping — history stays in CHANGELOG.md). Kit-dev rules stay in `AGENTS.md` §1–6; the brainloom instance block is appended below them. Bilingual convention: English structure, Spanish one-line summaries for the human (decision D-0002). Model tiers empty → harness default, stated when used (D-0004). Not shipped to users: the installer copies only `core/`, `adapters/`, `scripts/`.

## [0.8.0] - 2026-11-11

### Added
- Adversarial testing in verification: `verify` §3 (new, steps renumbered) makes every verification attack the input surface before trusting it — property-based testing (invariants over hundreds of random seeded inputs; stack lib or a seeded generator of your own; counterexamples shrunk to a minimal reproducing input) and fuzzing (malformed inputs at scale against trust boundaries; crash/hang/unhandled exception = finding; seed + trigger kept). No input surface → declared skip, never a silent drop. The `brainloom/verifier` mandate (§3) gains the same attack: invariant breaks and fuzz crashes are FAILs with seed + minimal trigger. Evidence before shipping the wording: dry run on a real zero-dep CLI (fixture-style project) — 4 invariants × 100 seeded runs found a real id-collision bug (85/100 fail, shrunk to 1 note); 300 fuzz vectors found 3 critical crash paths (malformed storage JSON, prototype-chain argv, silent data loss). Verified: `smoke.mjs` structural pass + `smoke.mjs --agent --skill verify` contract pass on the real harness.

## [0.7.1] - 2026-11-11

### Changed
- Verifier batching (token economy): independent refutation now runs ONE spawn per slice covering all its nodes — criteria + evidence in a single prompt — instead of one spawn per node (`verify` §4, `build-slice` §6). The refutation itself stays per-criterion; a mixed batch takes the highest model level its nodes require.
- `plan-project` proposal is now a file (`brain/.staging/proposal.md`): the refuter attacks the same text the user approves (no drift between reviewed and presented), the spawn prompt carries a path instead of the full proposal, and approval chat carries a summary + the decision ask per the anti chat-dump rule. The staging file is deleted once the roadmap records (or the proposal is rejected).

### Fixed
- `validate-brain` rejected nodes whose `verification.evidence` path was written relative to the project root (`brain/evidence/x.md`) instead of the brain dir (`evidence/x.md`) — found by a real `verify` contract run failing on `expect: valid brain`. The validator now accepts either form (existence is checked against disk, not against a path convention); `verify` §3 pins the canonical brain-relative form. Verified: project-relative existing file passes, missing file still errors.

No brain-format change: `schema_version` stays 2; no migration needed.

## [0.7.0] - 2026-11-11

### Added
- Fresh-eyes plan refutation, adapted from Google's Elephant-Goldfish Model (Apache-2.0): a plan must survive a reviewer that never saw the conversation that produced it. New read-only subagent `brainloom/refuter` (edits denied) that attacks a plan through four lenses — unstated assumptions/self-containment, YAGNI, reuse & placement, and implementation readiness (named files/symbols must exist in the repo; criteria must be observable). Cost-gated everywhere (token-economy rule — spawns are the exception, not the default): `plan-project` §7 spawns only for 3+ slices, a greenfield skeleton, or cross-slice shared contracts; `build-slice` §3 spawns only for 2+ nodes, a new architecture/walking skeleton, or a shared-contract node. Below the gate, the same four-lens pass runs in-session with an explicit not-independent declaration.
- Anti chat-dump rule in the `AGENTS.md` template (new "Long artifacts" section, appended at the end): proposals, drafts, refutation reports, and multi-section plans are files; chat gets a pointer plus the decision ask — long dumps pollute context for every later turn.

### Changed
- `reconcile` drift detection now also covers checked-in design docs (e.g. `docs/designs/`): divergence is reported, never auto-corrected — the user decides doc vs code (EGM's drift-report stance).

No brain-format change: `schema_version` stays 2; no migration needed.

## [0.6.0] - 2026-11-11

### Added
- **Fast-Path (zero-overhead routing)** for refined tasks. A deterministic gate — zero file reads — in the `AGENTS.md` template and `triage` §0: a task that names its exact target (file(s), symbol, or pattern), states the expected behavior, and touches no shared contract skips triage, the index, and blocking questions. It routes straight to `small-change` Fast-Path mode: path injection (read ONLY the named files, never `brain/index.md`), minimal diff, real verification, and the `memory-update` close still runs as telemetry behind the transparent gateway. Any doubt → not refined, full triage unchanged.

### Changed
- Fast-Path replies are data-only: files touched, one-line diff summary, verification command + observed result — no preamble or narration (output-token economy).
- `AGENTS.md` template reading order now applies to the full path only; the Fast-Path never reads the index.
- Kit-dev rule (repo `AGENTS.md` §6): the template is the static prefix every instance sends every turn — keep stable sections byte-stable (prompt caching only pays on an unchanged prefix), never reorder, volatile content stays at the end.

No brain-format change: `schema_version` stays 2; no migration needed.

## [0.5.1] - 2026-11-11

### Added
- Installer exposes the instance-facing kit scripts (`validate-brain`, `migrate`, `check-update`) at a stable config-local path — `~/.config/opencode/brainloom/` — recorded as `scripts_path` in the manifest. Skills no longer reference `<kit>/scripts` alone: they resolve `scripts_path` first (fallback `<kit_path>/scripts`), so agents stop hunting for the validator across the filesystem. `smoke.mjs` is excluded (it resolves the kit root from its own location and runs from the repo only). CI verifies the exposed scripts install and run.
- Model routing, portable across providers: a decision table in the `AGENTS.md` template (task type → `strong`/`balanced`/`fast`, with escalation rules — take the cheaper level first, escalate on failure), and `init-brain` now PROPOSES the level mapping by classifying available models by capability tier (largest reasoning model → strong, mid-tier → balanced, fastest/cheapest → fast) instead of leaving `models` empty. Works non-interactively too (mapping recorded as an assumption-decision).

### Fixed
- `init-brain` §3 wording: `config.yaml` lives at `core/templates/config.yaml`, not inside `core/templates/brain/` — the copy step now says so explicitly (found by a real agent contract run).

## [0.5.0] - 2026-11-11

### Added
- Merged the parallel GitHub line (Slices 3–7) into the 0.4.x verification line. From that line: skills `plan-project`, `build-slice`, `verify`, `small-change`, `adopt`, `reconcile`; OpenCode agents `brainloom/planner` (strong), `brainloom/scout` (fast), `brainloom/verifier` (read-only, refutation mandate); the full slash-command set (`/triage /plan-project /build-slice /fix /verify /reconcile /adopt /init-brain /kit-update`); bilingual (EN/ES) README; `CONTRIBUTING.md`; agent routing by model level in `triage` (§7).
- `## Verification` contracts for the six merged skills, so `smoke.mjs` structural mode covers the full skill set.

### Changed
- Reconciled both lines onto the 0.4.x brain format: status ladder with `implemented`, the `verify:` recipe, and `verification.level` (schema 2) apply everywhere — the merged skills now speak that vocabulary. Plugin `lib.js` keeps the BREAKING-detection fix (identical on both lines) plus the 0.4.1 cache fields. CI keeps the bash-pinned workflow with the smoke steps.
- CI actions bumped to `actions/checkout@v5` / `actions/setup-node@v5` on Node 24 (Node 20 deprecation warnings on the runners).
- `CONTRIBUTING.md` extended with the kit's own rules: verification contracts for every skill, `smoke.mjs` in the pre-push checklist, and the Windows ASCII/BOM rule for non-`.mjs` scripts.

No brain-format change: `schema_version` stays 2; no migration needed.

## [0.4.2] - 2026-11-11

### Fixed
- `smoke.mjs --agent` leaked its temp fixture copy on Windows: the nested `opencode run` shared the background service, which holds the cwd handle indefinitely. Agent runs now use `--standalone` (private server dies with the child process), so the runner's cleanup actually deletes the temp dir — verified with a real triage contract run: zero new temp dirs left behind.
- CI steps now run under a pinned `shell: bash` (present on every runner image); the `&&` syntax-check chain previously depended on the runner's default shell being PowerShell 7+. Every `run:` command was verified locally under git-bash exactly as written.

### Added
- Root `AGENTS.md` for the kit repo itself: the kit held to its own standard — "TODO se verifica" (no claim of done without executed evidence), development rules, and the pending init-brain dogfooding decision.

## [0.4.1] - 2026-11-10

### Fixed
- `check-update` serving a cache entry written by the session-notice plugin printed `up to date (?)` / `? -> undefined available` — the plugin cached `{update, line}` without explicit versions. The script now falls back to the cached `line`, and the plugin records `local`/`remote` in new cache entries.
- `core/migrations/README.md` referenced a CONTRIBUTING file that does not exist; it now points at the rules in the same document.

## [0.4.0] - 2026-11-10

### Added
- `scripts/smoke.mjs` — kit self-check + skill verification runner. Structural mode (CI, offline): every skill declares a `## Verification` contract, referenced fixtures exist and their brains stay valid, every shipped `.mjs` parses, and any `.ps1`/`.cmd`/`.bat` is ASCII-only or UTF-8 with BOM. `--agent` mode runs each contract's task through the harness (`opencode run`) on a throwaway fixture copy and asserts expected artifacts (`file` / `grep` / `valid` ops) — verifying a skill no longer costs a full session.
- Every core skill ships a `## Verification` section (fixture, task, observable asserts). `triage`, `memory-update` and `init-brain` are agent-runnable contracts; `kit-update` declares its manual drill.
- Node frontmatter `verification.level` (`smoke` | `full`): declared depth of verification. `full` = tests + functional run (default for product code); `smoke` = structure validated, behavior spot-checked — only for orchestration/spec deltas. Additive optional field, no schema bump (same policy as `verify:` in 0.3.0).
- `init-brain` non-interactive mode (§2b) for orchestrators: documented defaults, every assumption recorded as a reversible decision, then generate-validate-report. No more hand-rolled bypasses.
- `brain/conventions.md` template: file-ownership table — one writer per file, extended by multi-role orchestrators before raising `max_parallel_agents`.
- Windows script rule (ASCII-only or BOM for `.ps1`/`.cmd`/`.bat`) in `scripts/README.md` and `adapters/opencode/README.md`, enforced by `smoke.mjs`: PS 5.1 reads BOM-less UTF-8 as ANSI.
- `tests/fixtures/empty-project` for the init-brain contract.
- `tests/fake-agent.mjs` + CI step: the `--agent` plumbing (copy fixture → run → assert artifacts) is exercised offline on every push, no LLM needed.

### Changed
- `validate-brain` rejects invalid `verification.level` values (error) and warns when `verified`/`shipped` nodes declare no level — the smoke-vs-full gray zone is now visible instead of implicit.
- Installer: bootstrap installs (run from a temp copy without `.git`) record a self-contained kit snapshot under `<config>/brainloom-kit/` instead of a `kit_path` that dangles after the temp dir is deleted. Manifest gains `source: clone | snapshot`; re-installing from a real clone cleans the stale snapshot up. `kit-update` explains the clone requirement on snapshot installs.

## [0.3.0] - 2026-11-09

### Removed
- `core/migrations/0001-rename-verification-to-proof`: drill fiction committed into the real migrations dir — no template or skill ever spoke `proof:`. The drill fixture survives in `tests/fixtures/migrations/` (CI-only), where it belongs.

### Changed
- **[BREAKING]** Node `status` vocabulary: `done` is removed; `implemented` and `shipped` join the enum (`planned | in-progress | implemented | verified | shipped | superseded`). `verified` = agent-done and requires a filled `verification` block; `shipped` = human gates (commit/deploy/merge). Migration `0001-rename-done-to-shipped` upgrades brains (schema 1 → 2): `done` with evidence → `shipped`, `done`/`verified` without evidence → demoted to `implemented`. Core templates now ship `schema_version: 2`.
- `validate-brain` rejects `verified`/`shipped` with empty verification fields and warns when they lack a `verify` recipe. Pre-schema-2 `done` nodes validate as legacy warnings (migration `0001` rewrites or demotes them), so mid-chain runner validation cannot deadlock.

### Added
- Node frontmatter `verify:` field — the exact command sequence to re-verify a node's contract, written on first verification of an area so the next one is a single read.
- `memory-update` skill: explicit status ladder, the "no evidence → ceiling is `implemented`" rule, gates-never-block-local-verification rule, and first-verification recipe writing.
- `AGENTS.md` template: agent-done vs shipped distinction under "Done means".

## [0.2.0] - 2026-11-09

### Changed
- Drill (test-only, no brain format change): simulated BREAKING migration fixture `rename-verification-to-proof` for the update/migration flow; lives under `tests/fixtures/migrations/`.

### Added
- Core brain templates (`schema_version: 1`): index, vision, roadmap, conventions, shared registry, node, decision, config.
- Skills: `triage` (impact-radius classification and routing), `memory-update` (closing the loop: nothing is done until the brain reflects it).
- `AGENTS.md` instance template.
- Repo skeleton: `/core` (tool-agnostic), `/adapters/opencode`, `/scripts`, `/tests`.
- OpenCode adapter: global installer with collision guard (`adapters/opencode/install.mjs`), session-notice plugin (update notice on first prompt, opt-out, offline-tolerant).
- Skills: `init-brain` (onboarding: discover, ask, generate, validate), `kit-update` (changelog + confirm + update + migrate).
- `/kit-update` command.
- Scripts: `check-update`, `validate-brain`, `migrate` (dry-run default, backup, validation, rollback).
- Migrations skeleton + rules (`core/migrations/`), test fixtures for validation and the update/migration drill.
- CI: cross-OS (ubuntu/macos/windows) syntax check, brain validation, migration dry-run, offline tolerance.

## [0.1.0] - 2026-11-09

Parallel line (merged in 0.5.0). Its unique content — beyond what 0.2.0 already
recorded — was:

### Added
- Skills: `plan-project` (whole idea → ordered vertical slices, shared candidates, risks; records roadmap after approval) and `build-slice` (decompose into nodes, acceptance criteria first, thin end-to-end, functional verification, close the slice).
- Skills: `verify` (criteria audit, tests, functional execution, independent refutation) and `small-change` (encapsulated FIX/S flow).
- Skills: `adopt` (existing codebase → area nodes with per-area user OK, honest post-hoc documentation, conventions + registry from real usage) and `reconcile` (drift detection: stale pointers, lying statuses, broken links, index rot; mechanical fixes direct, semantic after user OK).
- OpenCode agent `brainloom/verifier`: independent read-only subagent with a refutation mandate (edits denied, execution allowed).
- OpenCode agents `brainloom/planner` (strong level: ambiguous triage, L planning) and `brainloom/scout` (fast level: targeted reading, pointer summaries).
- Full command set: /triage, /plan-project, /build-slice, /fix, /verify, /reconcile, /adopt, /init-brain, /kit-update.
- Agent routing by level (strong/balanced/fast) resolved from instance config at spawn time in skills.
- Bilingual (EN/ES) README; `CONTRIBUTING.md`.
