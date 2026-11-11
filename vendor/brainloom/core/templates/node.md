---
id: N-0001
title: (one line, imperative)
type: feature        # feature | fix | refactor | chore | spike
size: S              # S | M | L
status: planned      # planned | in-progress | implemented | verified | shipped | superseded
slice:               # slice id/name this node belongs to (empty for standalone S/FIX)
depends_on: []       # node ids that must be done first
affects: []          # node ids this one touches or changes
replaces: []         # node ids superseded by this one
contracts_touched: []  # shared APIs, schemas, domain models changed
code: []             # pointers, not copies. e.g. ["src/app.py -> UserService.create"]
reversibility: easy  # easy | medium | hard
decisions: []        # decision ids (see decisions/)
acceptance_criteria: []  # written BEFORE coding; observable behavior, not implementation
verify: []          # exact command sequence to re-verify this node's contract; write it on FIRST verification of the area
verification:
  tests: ""          # what test commands ran and result
  functional: ""     # what was actually executed and result
  evidence: ""       # path under evidence/
date: 2026-11-09
---

## Context
(Why this node exists. Max 5 lines.)

## Notes
(Optional. Body stays under 40 lines total.)
