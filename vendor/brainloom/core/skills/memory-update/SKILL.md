---
name: Brainloom Memory Update
description: Update the project brain after finishing work — node status, verification fields, code pointers, index, registry candidates, and decisions. Use when a task, fix, or slice was completed or changed status; nothing is done until the brain reflects it.
---

# Memory Update

The code is the source of truth; the brain is a map with pointers. This skill
is the closing step of any task. No node update → not done.

## 1. Update the node
- `status` ladder: `planned` → `in-progress` → `implemented` → `verified` → `shipped`.
  - `implemented`: code complete, verification NOT yet run. This is the ceiling
    without evidence — never write `verified` (or "fixed") on unrun code.
  - `verified` (agent-done): you actually ran something. Fill `verification`
    (command + result + evidence path) in the same edit. Blocked from verifying
    locally? Stay `implemented` and note the blocker — commit/deploy gates
    `shipped`, never verification.
  - Declare depth in the same edit — `verification.level`:
    `full` = tests + functional run (the default for product code);
    `smoke` = structure validated, behavior spot-checked (ONLY for
    orchestration/spec deltas with no runtime behavior of their own).
    Reviewers read this field first; undeclared depth reads as unverified.
  - `shipped`: human gates passed (commit, deploy, merge). Ask once, record the
    answer in decisions, stop clean. No limbo.
  - `superseded` when replaced (keep the link).
- First time you verify an area: write the exact command sequence into `verify:`
  so the next verification is one read, not a rediscovery.
- Fill `verification`: tests run (+ result), functional check performed
  (+ result), evidence path.
- Fill or refresh `code` pointers as `path/file.ext -> symbol`. Pointers, never copies.
- Update `decisions`, `affects`, `replaces`, `contracts_touched` if they changed.

## 2. Acceptance criteria audit
Every `acceptance_criteria` entry must be met-and-observable, or explicitly
marked unmet with a reason. No silent drops, no silent scope changes.

## 3. Evidence
Write one short file per verification under `brain/evidence/`: what ran,
expected vs observed, date. Reference it from the node's `verification.evidence`.

## 4. Registry
- Spotted a duplication candidate (2nd occurrence)? Add it to
  `brain/shared/registry.md` under Candidates. Do NOT abstract yet —
  rule of three: abstract on the 3rd occurrence, promoted from Candidates.
- Before writing anything new: consult `registry.md` and `brain/conventions.md`
  first. If it exists, reuse it.

## 5. Index
Update `brain/index.md`: new nodes, changed statuses, changed links, current
slice. Keep it under 150 lines — if over, summarize or split.

## 6. Decisions
Any non-obvious choice or assumption made along the way? One short ADR in
`brain/decisions/` (context, decision, reversibility). Reversible assumptions
get recorded, not asked.

## 7. Keep it light
Any file past its budget (node body >40 lines, index >150 lines)? Split or
summarize it now. The brain stays a map, not a transcript.

## Verification
Fixture: tests/fixtures/sample-project
Task: Node N-0001 (Add greet function) was just implemented and node app.js now runs successfully printing a greeting; run memory-update to close it, writing evidence.
- [ ] N-0001 climbs planned -> verified in one honest step: verification block filled, level declared, evidence file written
- [ ] brain/index.md row for N-0001 shows the new status

expect: grep brain/nodes/N-0001.md "status: verified"
expect: grep brain/nodes/N-0001.md "level: full"
expect: grep brain/nodes/N-0001.md "evidence: evidence/N-0001.md"
expect: file brain/evidence/N-0001.md
expect: grep brain/index.md "feature | S | verified"
