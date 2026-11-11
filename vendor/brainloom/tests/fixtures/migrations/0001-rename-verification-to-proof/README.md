# Migration 0001: rename node `verification` block to `proof`

- Schema: `1` → `2`
- Breaking: yes. Node frontmatter `verification:` becomes `proof:`
  (subfields `tests`/`functional`/`evidence` keep their names).

## What it does
TEST FIXTURE — simulates a real BREAKING format change for the update/migration
drill. Renames the frontmatter block key in every node file.

## Verification
The runner validates the brain after applying; `proof:` nodes still pass
(the validator checks the subfields, which are unchanged).
