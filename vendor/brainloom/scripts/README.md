# scripts

Portable cross-platform scripts (Node.js, standard library only — no npm
install, no dependencies). Supported: Windows, macOS, Linux.

| Script | Purpose |
|---|---|
| `check-update.mjs` | One-line kit update notice (git fetch only, cached 24h, offline-tolerant). Exit 1 = update available. |
| `validate-brain.mjs` | Structural validation of a brain directory (config keys, node frontmatter, links, code pointers, evidence). |
| `migrate.mjs` | Runs pending schema migrations in order. Dry-run by default; `--yes` applies with backup, validation, and automatic rollback. |
| `smoke.mjs` | Kit self-check + skill verification runner. Structural mode (CI): every skill declares a `## Verification` contract, fixtures stay valid, scripts parse, encoding is Windows-safe. `--agent` mode runs each contract through the harness on a throwaway fixture copy and checks expected artifacts. |

## Windows rule (any shipped script)

Prefer plain Node `.mjs` — Node always reads UTF-8 correctly on every OS.
Any `.ps1`/`.cmd`/`.bat` must be **ASCII-only or UTF-8 with BOM**: Windows
PowerShell 5.1 reads BOM-less UTF-8 as ANSI and mangles non-ASCII (an
em-dash becomes a smart quote and breaks strings). `smoke.mjs` enforces this
in structural mode.
