# Migration 0002: forced failure (rollback drill)

- Schema: `2` → `3`
- Breaking: no.

## What it does
TEST FIXTURE ONLY — throws during apply, on purpose, so the drill can prove the
runner rolls the brain back to its pre-migration backup.
