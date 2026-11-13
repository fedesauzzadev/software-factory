---
name: Brainloom Reconcile
description: Detect and repair drift between the brain and the real code — stale code pointers, statuses that lie, links to deleted nodes, index out of date — after manual work, hotfixes outside the flow, refactors, or as periodic hygiene. Use when the brain seems out of sync with the code, before starting new work on an old project, or when the user asks to reconcile.
---

# Reconcile

The brain is a map; maps rot. This skill re-syncs map to territory.
It CORRECTS the brain to match the code — never the other way around.

## 1. Detect drift
- **Broken pointers**: every `code` entry (path -> symbol) in every node — does
  the file exist? (Cheap: stat the path part; grep the symbol only on doubt.)
- **Lying statuses**: `in-progress` nodes whose code clearly landed long ago;
  `planned` nodes that already exist in code; `verified`/`shipped` nodes whose
  AC no longer holds on a quick check.
- **Broken links**: `depends_on`/`affects`/`replaces` pointing at missing nodes.
- **Index rot**: nodes missing from `brain/index.md`; index rows for dead nodes.
- **Out-of-band changes** (if git): commits touching files that no node points to.
- **Design-doc drift** (if the project keeps checked-in design docs, e.g.
  `docs/designs/`): claims that no longer match the code get REPORTED only —
  the user decides whether the doc or the code is wrong.
- **Budgets**: files over their line budgets (node body 40, index 150).

## 2. Classify each drift
- **Mechanical** (pointer renamed, file moved, index row missing): fix directly.
- **Semantic** (behavior changed without a node; AC no longer true): draft the
  minimal correction — update the node, or split a new node with
  `affects`/`replaces` links — and show the user before writing.
- **Unknown** (code nobody can explain): ask; the answer may be an ADR or a
  spike node. Never guess silently.

## 3. Rules
- Never delete decisions (ADRs); supersede them (`replaces` + new ADR).
- Reconcile records reality; it never verifies and never promotes a status.
  When evidence no longer holds it DEMOTES (`verified`/`shipped` →
  `implemented`, stale evidence noted).
- Bulk fixes grouped in ONE report, not a stream of edits.

## 4. Close
- Apply fixes (mechanical directly, semantic after user OK).
- Re-run `node <scripts>/validate-brain.mjs <project>/brain` — must pass.
  (`<scripts>` = `scripts_path` from `~/.config/opencode/brainloom.kit.json`,
  fallback `<kit_path>/scripts`.)
- Report: drifts found / fixed / deferred (with reasons), nodes touched,
  residual unknowns.

## Verification
Fixture: tests/fixtures/drift-project
Task: Run reconcile non-interactively — mechanical drift only, no semantic drift present.
- [ ] Broken code pointers repaired to the renamed symbol
- [ ] Missing index row restored
- [ ] No status promoted; validate passes at the end

expect: grep brain/nodes/N-0002.md "greetUser"
expect: grep brain/index.md "N-0003"
expect: valid brain
