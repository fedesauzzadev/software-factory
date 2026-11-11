# Migration 0001: status vocabulary — agent-done vs shipped

- Schema: `1` → `2`
- Breaking: yes. Node `status` enum loses `done`, gains `implemented` and `shipped`.

## What it does
- `status: done` WITH any of `tests`/`functional`/`evidence` filled → `shipped`
  (commit/deploy/merge gates passed — the old meaning of done).
- `status: done` or `verified` WITHOUT evidence → `implemented`
  (code exists, nothing was verified — the honest state; the validator would
  reject these post-migration otherwise).

## Why
"Done" bundled two different finishes: the agent's (code + local verification)
and the human's (commit/deploy). Agents stalled in limbo waiting on gates that
were never theirs, or worse, wrote `fixed`/`done` on unverified code. `verified`
(= agent-done, evidence required) and `shipped` (= human gates) split them.

## Verification
The runner validates the brain after applying; demoted `implemented` nodes pass
(evidence is only required for `verified`/`shipped`).
