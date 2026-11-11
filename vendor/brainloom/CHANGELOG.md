# Changelog

All notable changes to this project are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning: [SemVer](https://semver.org/).
Entries that change the brain format, config, or skill contracts are marked **[BREAKING]**.

## [Unreleased]

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
