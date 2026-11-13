# Migrations

Each directory `NNNN-description/` migrates a brain from schema `NNNN` to
`NNNN+1`. `NNNN` is the schema the migration STARTS from.

## When you need one

Only when the brain FORMAT or the config format changes. Changes confined to
skills, agents, or commands need NO migration and NO schema bump.

## Rules

1. Each migration directory contains `README.md` (what changes and why) and
   `migrate.mjs` exporting `migrate({ brainDir, dryRun })` — plain Node, stdlib only.
2. **Idempotent**: applying to an already-migrated brain is a no-op.
3. `dryRun: true` prints the plan (`[NNNN] ...` lines); it must change NOTHING.
4. The runner backs up to `brain/.backup/`, applies your script, validates the
   brain, and rolls back on any failure. Your script must **throw** on failure —
   partial writes are restored by the runner.
5. Bump `schema_version` expectations and add the `[BREAKING]` changelog entry
   in the same change (rules above).
