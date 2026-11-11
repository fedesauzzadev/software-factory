# scripts

Portable cross-platform scripts (Node.js, standard library only — no npm
install, no dependencies). Supported: Windows, macOS, Linux.

| Script | Purpose |
|---|---|
| `check-update.mjs` | One-line kit update notice (git fetch only, cached 24h, offline-tolerant). Exit 1 = update available. |
| `validate-brain.mjs` | Structural validation of a brain directory (config keys, node frontmatter, links, code pointers, evidence). |
| `migrate.mjs` | Runs pending schema migrations in order. Dry-run by default; `--yes` applies with backup, validation, and automatic rollback. |
