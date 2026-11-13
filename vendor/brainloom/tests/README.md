# tests

Fixtures and helpers for kit verification (`scripts/smoke.mjs`) and CI.

- `fixtures/sample-project` — real mini project with a brain; used by
  validate-brain, the migration dry-run, and the triage/memory-update/
  verify/small-change/build-slice skill contracts.
- `fixtures/drift-project` — same project with baked-in drift (renamed symbol,
  missing index row) for the reconcile contract.
- `fixtures/empty-project` — no brain yet; used by the init-brain contract.
- `fixtures/migrations/` — drill migrations (CI-only, never shipped as real).
- `fake-agent.mjs` — offline stand-in for `opencode run` that applies the
  triage contract to the fixture; proves smoke.mjs `--agent` plumbing in CI
  without an LLM. Pass `--noop` to simulate an agent that did nothing.
