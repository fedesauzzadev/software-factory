#!/usr/bin/env node
// brainloom check-update — one-line kit update notice.
// Offline-tolerant (fails silent), cached for 24h, no telemetry (git fetch only).
// Usage: node check-update.mjs [--kit <path>] [--manifest <path>] [--force]
// Exit codes: 0 = no update / offline / unknown; 1 = update available.
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { promisify } from "node:util";

const run = promisify(execFile);
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };

const configDir = process.env.XDG_CONFIG_HOME
  ? join(process.env.XDG_CONFIG_HOME, "opencode")
  : join(homedir(), ".config", "opencode");
const cachePath = join(configDir, "brainloom.check.json");
const TTL = 24 * 60 * 60 * 1000;

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const semver = (s) => { const m = /(\d+)\.(\d+)\.(\d+)/.exec(String(s ?? "")); return m ? [+m[1], +m[2], +m[3]] : null; };
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

async function git(kit, ...a) {
  const { stdout } = await run("git", ["-C", kit, ...a], { timeout: 5000 });
  return stdout.trim();
}

async function remoteBranch(kit) {
  try { return (await git(kit, "rev-parse", "--abbrev-ref", "origin/HEAD")).replace(/^origin\//, ""); } catch {}
  for (const b of ["main", "master"]) {
    try { await git(kit, "rev-parse", `origin/${b}`); return b; } catch {}
  }
  throw new Error("no remote branch");
}

function changelogBetween(text, from, to) {
  const start = text.indexOf(`## [${to}]`);
  if (start < 0) return "";
  const end = text.indexOf(`## [${from}]`);
  return text.slice(start, end > start ? end : undefined);
}

async function remoteState(kit, localVersion) {
  await git(kit, "fetch", "--quiet");
  const branch = await remoteBranch(kit);
  const version = semver(await git(kit, "show", `origin/${branch}:VERSION`));
  if (!version) throw new Error("remote VERSION unreadable");
  let breaking = false;
  try {
    const log = await git(kit, "show", `origin/${branch}:CHANGELOG.md`);
    breaking = changelogBetween(log, localVersion.join("."), version.join(".")).includes("BREAKING");
  } catch { /* changelog optional for detection */ }
  return { version, breaking };
}

function report(s) {
  if (s.update) {
    // cache entries written by the notice plugin carry `line` but no local/remote
    const fromTo = s.local ? `${s.local} -> ${s.remote}` : (s.line ?? "?").replace(" [BREAKING]", "");
    console.log(`brainloom: ${fromTo} available${s.breaking ? " [BREAKING]" : ""}. Update with the kit-update skill (/kit-update).`);
    process.exit(1);
  }
  const v = s.local ?? s.line?.split(" -> ")[0] ?? s.remote ?? "?";
  console.log(`brainloom: up to date (${v})`);
  process.exit(0);
}

const kit = flag("kit") ?? readJson(flag("manifest") ?? join(configDir, "brainloom.kit.json"))?.kit_path;
if (!kit || !existsSync(kit)) {
  console.log("brainloom: kit location unknown — run the installer or pass --kit <path>");
  process.exit(0);
}

const cached = readJson(cachePath);
if (!args.includes("--force") && cached?.ts && Date.now() - cached.ts < TTL) {
  report(cached);
}

try {
  const local = semver(readFileSync(join(kit, "VERSION"), "utf8"));
  const { version: remote, breaking } = await remoteState(kit, local);
  const state = { ts: Date.now(), local: local.join("."), remote: remote.join("."), breaking, update: cmp(remote, local) > 0 };
  try { mkdirSync(configDir, { recursive: true }); writeFileSync(cachePath, JSON.stringify(state)); } catch { /* cache is best-effort */ }
  report(state);
} catch {
  console.log("brainloom: update check skipped (offline or no remote)");
  process.exit(0);
}
