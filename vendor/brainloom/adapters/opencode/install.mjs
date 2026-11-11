#!/usr/bin/env node
// brainloom installer (opencode adapter) — copies kit files into the global
// opencode config so skills/commands/agents/plugins are available everywhere.
// Usage: node install.mjs [--config-dir <path>] [--force]
// Never overwrites an existing, different file without --force: it reports
// collisions first and aborts before copying anything.
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const force = args.includes("--force");

const kitRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..", "..");
const configDir = flag("config-dir")
  ?? (process.env.XDG_CONFIG_HOME ? join(process.env.XDG_CONFIG_HOME, "opencode") : join(homedir(), ".config", "opencode"));
const manifestPath = join(configDir, "brainloom.kit.json");

const version = readFileSync(join(kitRoot, "VERSION"), "utf8").trim();
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const dirs = (p) => existsSync(p) ? readdirSync(p).filter(f => statSync(join(p, f)).isDirectory()) : [];
const files = (p) => existsSync(p) ? readdirSync(p).filter(f => statSync(join(p, f)).isFile()) : [];
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
const sameContent = (a, b) => {
  if (!existsSync(b)) return false;
  if (isDir(a) !== isDir(b)) return false;
  if (!isDir(a)) return readFileSync(a).equals(readFileSync(b));
  const names = readdirSync(a);
  return names.every(n => sameContent(join(a, n), join(b, n))) && readdirSync(b).length === names.length;
};

// Build the copy plan: [source, target] pairs, grouped by kind for reporting.
const plan = [];
for (const s of dirs(join(kitRoot, "core", "skills"))) plan.push(["skill", join(kitRoot, "core", "skills", s), join(configDir, "skills", s)]);
for (const f of files(join(kitRoot, "adapters", "opencode", "commands"))) plan.push(["command", join(kitRoot, "adapters", "opencode", "commands", f), join(configDir, "commands", f)]);
const agentsSrc = join(kitRoot, "adapters", "opencode", "agents");
if (existsSync(agentsSrc)) for (const d of dirs(agentsSrc)) for (const f of files(join(agentsSrc, d))) plan.push(["agent", join(agentsSrc, d, f), join(configDir, "agents", d, f)]);
const pluginSrc = join(kitRoot, "adapters", "opencode", "plugin");
for (const f of files(pluginSrc)) plan.push(["plugin", join(pluginSrc, f), join(configDir, "plugins", "brainloom", f)]);

// Collision check: abort before copying anything if a target exists and differs.
const conflicts = plan.filter(([, src, dst]) => existsSync(dst) && !sameContent(src, dst));
if (conflicts.length && !force) {
  console.log(`brainloom ${version}: ${conflicts.length} collision(s) — nothing was copied. Re-run with --force to overwrite.`);
  for (const [kind, src, dst] of conflicts) console.log(`  ${kind}: ${relative(configDir, dst)} differs from kit's ${relative(kitRoot, src)}`);
  process.exit(1);
}

mkdirSync(configDir, { recursive: true });
const installed = [];
for (const [kind, src, dst] of plan) {
  mkdirSync(join(dst, ".."), { recursive: true });
  if (existsSync(dst) && sameContent(src, dst)) { installed.push(dst); continue; } // idempotent
  statSync(src).isDirectory() ? cpSync(src, dst, { recursive: true }) : copyFileSync(src, dst);
  installed.push(dst);
  console.log(`installed ${kind}: ${relative(configDir, dst)}`);
}

// Remove files recorded by a previous install that this version no longer ships.
const old = readJson(manifestPath);
if (old?.files) {
  for (const f of old.files) {
    if (installed.includes(f) || !existsSync(f) || !f.startsWith(configDir)) continue;
    rmSync(f, { recursive: true, force: true });
    console.log(`removed stale: ${relative(configDir, f)}`);
  }
}

writeFileSync(manifestPath, JSON.stringify({ kit_path: kitRoot, kit_version: version, installed_at: new Date().toISOString(), files: installed }, null, 2));
console.log(`brainloom ${version} installed — kit clone recorded at ${kitRoot}`);
