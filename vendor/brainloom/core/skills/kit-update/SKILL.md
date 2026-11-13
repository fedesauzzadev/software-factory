---
name: Brainloom Kit Update
description: Check for brainloom kit updates, show the changelog with BREAKING highlights, and after explicit user confirmation update the kit clone, reinstall global files, and migrate project brains. Use when the user asks to update brainloom, when a session notice reports a kit update, or when /kit-update runs.
---

# Kit Update

Never automatic: every state-changing step needs explicit user confirmation.

## 1. Check
- Kit location: manifest `~/.config/opencode/brainloom.kit.json` → `kit_path`
  (ask the user if absent).
- Manifest says `source: snapshot` (bootstrap install, no git clone)? The kit
  cannot be git-pulled. Say so, offer to install from a clone (or `--kit
  <path>`), and stop after showing the changelog if none is available.
- Run `node <kit>/scripts/check-update.mjs --force`.
- No update → say so and stop.
- Project opted out of notices (`update_check.enabled: false` in
  `brain/config.yaml`)? Note it and ask before continuing.

## 2. Show what's coming
- Print the CHANGELOG.md sections between the current and the new version;
  highlight every **[BREAKING]** line.
- State the migration plan: current brain `schema_version` vs the migrations
  that would run (directories in `core/migrations/` numbered above it).

## 3. Confirm → update the kit
- `git -C <kit> pull` (show a short summary).
- Re-run the installer: `node <kit>/adapters/opencode/install.mjs`.
  If it reports collisions, show them and let the user decide (--force or fix);
  never overwrite foreign files silently.

## 4. Migrate brains
For this project (plus any others the user lists):
- Dry-run first: `node <kit>/scripts/migrate.mjs <project>/brain` — show the plan.
- On user confirmation apply with `--yes`.
- Verify: runner validation passed; `schema_version` and `kit_version` in
  `brain/config.yaml` were bumped.
- On failure: the runner already rolled back automatically. Report the reason
  and that the brain is unchanged.

## 5. Report
Versions before/after, migrations applied, files reinstalled, anything skipped.

## Verification
Fixture: tests/fixtures/sample-project
Manual drill (no Task line — agent mode skips it): the CI migration dry-run
step exercises migrate on this fixture; the update path is drilled against a
scratch clone + bare remote before any release that touches check-update,
install, or this skill (see the 0.2.0 drill in CHANGELOG.md).
- [ ] `node scripts/migrate.mjs tests/fixtures/sample-project/brain --migrations-dir tests/fixtures/migrations` plans cleanly
- [ ] `node scripts/smoke.mjs` structural pass
