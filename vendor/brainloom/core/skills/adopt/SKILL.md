---
name: Brainloom Adopt
description: Map an existing codebase into brain nodes area by area — without reading everything at once, with user approval per area — and populate conventions and the shared registry from what already exists. Use when init-brain detects an existing project, or when the user asks to adopt/backfill a codebase into the brain.
---

# Adopt (existing codebase → brain)

Map the PRESENT, not the future. Goal: enough nodes, pointers, and links to
reason about impact — not a node per file.

## 1. Preconditions
`brain/` exists (run `init-brain` first if not). Read `brain/vision.md`; if
empty, agree with the user on 2-5 sentences of what the project IS/IS NOT.

## 2. Survey cheaply (do NOT read all files)
- Directory tree, 2 levels deep; build/dependency files; entry points.
- Propose AREAS (coarse, by domain/module/dir). Typical: 3-8 areas for a
  normal project. One area ≈ one future node's worth of reasoning.

## 3. Per area — with explicit user OK before moving to the next
For each area (show the list first; the user approves order and scope):
- Read ONLY that area's key files (entry point + main modules). Skim, don't audit.
- Create ONE node: `type: chore`, size by gut feel (S/M/L), `status:
  implemented` — the honest ceiling for adopted code: it exists, but the kit
  did not verify it — with an explicit adoption note (see honesty rules below).
- Fill: `code` pointers (path -> symbol), `contracts_touched` (public APIs,
  schemas, domain models the area owns), links to already-mapped areas
  (`depends_on` / `affects`).
- Show the drafted node to the user → OK → register in index → next area.
  User says "skip"? Mark the area in index as unmapped; do not push.

## Honesty rules for adopted nodes
- `acceptance_criteria` are DOCUMENTED CURRENT BEHAVIOR (observed from code),
  not pre-written criteria. Mark the node body: "Adopted: behavior documented
  post-hoc from existing code."
- `verification.functional`: "adopted — pre-existing code assumed working in
  production (user-confirmed); not verified by the kit". Never invent evidence.
- Doubts about what something does → ask the user; their answer may deserve an ADR.

## 4. conventions and registry (this is where they get real content)
- `brain/conventions.md`: patterns observed across areas (architecture, style,
  error handling, testing habits) — one bullet each, confirmed by ≥2 areas.
- `brain/shared/registry.md` → In use: reusable code ALREADY shared (helpers,
  utils, base classes) with where/used-by. Candidates: near-duplicates spotted
  across areas (they are at occurrence 2 by definition).

## 5. Close
- `brain/roadmap.md`: only known future work the user mentions; otherwise empty.
- Run `node <scripts>/validate-brain.mjs <project>/brain` — must pass.
  (`<scripts>` = `scripts_path` from `~/.config/opencode/brainloom.kit.json`,
  fallback `<kit_path>/scripts`.)
- Report: areas mapped/skipped, nodes created, contracts found, registry
  entries, open questions.

## Verification
Fixture: tests/fixtures/empty-project
Manual drill (no Task line — adopt is interactive by design: per-area user OK).
- [ ] One area node created: type chore, status implemented, body marked "Adopted: behavior documented post-hoc"
- [ ] verification.functional carries the adoption note — never invented evidence
- [ ] validate-brain passes after the run
