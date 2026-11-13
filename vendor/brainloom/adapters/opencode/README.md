# adapters/opencode

OpenCode adapter for brainloom. Everything here maps the tool-agnostic `/core`
onto OpenCode's real formats:

- `install.mjs` — global installer (`~/.config/opencode/`): skills, commands,
  agents, plugin. Collision-safe (never overwrites a different existing file
  without `--force`), idempotent, cleans up files removed from the kit, and
  records the kit origin in `brainloom.kit.json` (used by check-update and
  kit-update). `source: clone` = git-pullable origin; `source: snapshot` =
  bootstrap install from a temp copy, self-contained under
  `~/.config/opencode/brainloom-kit/` (git-based updates then require
  re-installing from a clone).
- `agents/brainloom/` — subagents, spawnable as `brainloom/<role>`:
  `planner` (strong level), `verifier` (read-only, refutation mandate),
  `scout` (fast level, pointer summaries). No hardcoded models: the spawning
  skill resolves the level from the project's `brain/config.yaml`.
- `commands/` — slash commands, thin wrappers over core skills:
  `/triage /plan-project /build-slice /fix /verify /reconcile /adopt
  /init-brain /kit-update`.
- `plugin/` — session notice: one-line update check on the first prompt of a
  session (git fetch only, 24h cache, offline-tolerant, per-project opt-out).
  Plain object export, no SDK imports (a bare file under `plugins/` cannot
  resolve packages).

Windows rule: any `.ps1`/`.cmd`/`.bat` added here must be ASCII-only or UTF-8
with BOM (see `scripts/README.md`). Prefer plain Node `.mjs`.
