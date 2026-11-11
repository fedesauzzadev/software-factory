#!/usr/bin/env node
// brainloom migrate — run pending brain schema migrations in order.
// Usage: node migrate.mjs <brainDir> [--migrations-dir <dir> | --kit <path>] [--yes]
// Default mode is DRY-RUN (plan only). Applying requires --yes.
// Guarantees: backup before each migration (brain/.backup/), validation after,
// automatic rollback to the pre-migration backup on any failure.
// Convention: migration dir NNNN-* migrates schema NNNN -> NNNN+1.
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { pathToFileURL } from "node:url";
import { validateBrain } from "./validate-brain.mjs";

const args = process.argv.slice(2);
const brainDir = args.find(a => !a.startsWith("--"));
const yes = args.includes("--yes");
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };

function kitPathFromManifest() {
  const dir = process.env.XDG_CONFIG_HOME
    ? join(process.env.XDG_CONFIG_HOME, "opencode")
    : join(homedir(), ".config", "opencode");
  try { return JSON.parse(readFileSync(join(dir, "brainloom.kit.json"), "utf8")).kit_path; } catch { return null; }
}

const configPath = brainDir ? join(brainDir, "config.yaml") : null;
if (!brainDir || !existsSync(configPath)) {
  console.error("usage: migrate.mjs <brainDir> [--migrations-dir <dir> | --kit <path>] [--yes]");
  process.exit(2);
}

const kit = flag("kit") ?? kitPathFromManifest();
const migDir = flag("migrations-dir") ?? (kit ? join(kit, "core", "migrations") : null);
if (!migDir || !existsSync(migDir)) {
  console.error("migrations dir not found — pass --migrations-dir <dir> or --kit <path>");
  process.exit(2);
}
const kitVersion = kit && existsSync(join(kit, "VERSION"))
  ? readFileSync(join(kit, "VERSION"), "utf8").trim() : null;

const readConfig = () => readFileSync(configPath, "utf8");
const schema = () => parseInt(/^schema_version:\s*(\d+)/m.exec(readConfig())[1], 10);
const all = readdirSync(migDir).filter(d => /^\d{4}-/.test(d)).sort();
const pending = all.filter(d => +d.slice(0, 4) >= schema());
const target = pending.length ? +pending[pending.length - 1].slice(0, 4) + 1 : schema();

if (!pending.length) {
  console.log(`brain schema ${schema()} — no pending migrations`);
  process.exit(0);
}

const backup = (n) => {
  const dst = join(brainDir, ".backup", `pre-${String(n).padStart(4, "0")}-${Date.now()}`);
  mkdirSync(dst, { recursive: true });
  for (const e of readdirSync(brainDir)) if (e !== ".backup") cpSync(join(brainDir, e), join(dst, e), { recursive: true });
  return dst;
};
const restore = (bk) => {
  for (const e of readdirSync(brainDir)) if (e !== ".backup") rmSync(join(brainDir, e), { recursive: true, force: true });
  for (const e of readdirSync(bk)) cpSync(join(bk, e), join(brainDir, e), { recursive: true });
};
const bumpConfig = (n) => {
  let c = readConfig().replace(/^schema_version:\s*\d+/m, `schema_version: ${n}`);
  if (kitVersion) c = c.replace(/^kit_version:\s*\S+/m, `kit_version: ${kitVersion}`);
  writeFileSync(configPath, c);
};

console.log(yes
  ? `APPLY — brain schema ${schema()} -> ${target} (${pending.length} migration(s))`
  : `DRY-RUN (apply with --yes) — brain schema ${schema()} -> ${target}, ${pending.length} migration(s)`);

for (const d of pending) {
  const n = +d.slice(0, 4);
  const mod = await import(pathToFileURL(join(migDir, d, "migrate.mjs")).href);

  if (!yes) { await mod.migrate({ brainDir, dryRun: true }); continue; }

  const bk = backup(n);
  try {
    await mod.migrate({ brainDir, dryRun: false });
    bumpConfig(n + 1);
    const { errors } = validateBrain(brainDir);
    if (errors.length) throw new Error(`post-migration validation failed:\n  ${errors.join("\n  ")}`);
    console.log(`ok    ${d}: applied (schema ${n} -> ${n + 1})`);
  } catch (e) {
    restore(bk);
    console.error(`FAIL  ${d}: ${e.message}`);
    console.error(`      rolled back from backup — brain unchanged at schema ${schema()}`);
    process.exit(1);
  }
}

if (!yes) console.log("plan complete — no files were modified");
else console.log(`done — schema ${schema()}${kitVersion ? `, kit_version ${kitVersion}` : ""}`);
