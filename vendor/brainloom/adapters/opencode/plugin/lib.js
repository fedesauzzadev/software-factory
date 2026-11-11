// brainloom plugin helpers — plain Node only.
// A bare file under plugins/ cannot resolve opencode packages, so this lib is self-contained.
import { execFile } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { promisify } from "node:util";

const run = promisify(execFile);
const configDir = process.env.XDG_CONFIG_HOME
  ? join(process.env.XDG_CONFIG_HOME, "opencode")
  : join(homedir(), ".config", "opencode");
const cachePath = join(configDir, "brainloom.check.json");
const TTL = 24 * 60 * 60 * 1000;

// True when the project has a brain and did NOT opt out of update notices.
export function brainWantsNotices(projectDir) {
  try {
    const config = readFileSync(join(projectDir, "brain", "config.yaml"), "utf8");
    return !/^ {2}enabled:\s*false\s*$/m.test(config.split(/^update_check:/m)[1] ?? "");
  } catch { return false; }
}

function kitPath() {
  try { return JSON.parse(readFileSync(join(configDir, "brainloom.kit.json"), "utf8")).kit_path; } catch { return null; }
}

function readJson(p) { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } }
const semver = (s) => { const m = /(\d+)\.(\d+)\.(\d+)/.exec(String(s ?? "")); return m ? [+m[1], +m[2], +m[3]] : null; };
const cmp = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];

async function git(kit, ...a) {
  const { stdout } = await run("git", ["-C", kit, ...a], { timeout: 5000 });
  return stdout.trim();
}

// Returns { update, line } or null (offline / unknown / not installed).
export async function checkUpdate({ force = false } = {}) {
  const kit = kitPath();
  if (!kit || !existsSync(kit)) return null;

  if (!force) {
    const cached = readJson(cachePath);
    if (cached?.ts && Date.now() - cached.ts < TTL) return cached;
  }

  let state = null;
  try {
    const local = semver(readFileSync(join(kit, "VERSION"), "utf8"));
    await git(kit, "fetch", "--quiet");
    let branch = null;
    try { branch = (await git(kit, "rev-parse", "--abbrev-ref", "origin/HEAD")).replace(/^origin\//, ""); } catch {}
    if (!branch) for (const b of ["main", "master"]) { try { await git(kit, "rev-parse", `origin/${b}`); branch = b; break; } catch {} }
    if (!branch) throw new Error("no remote branch");
    const remote = semver(await git(kit, "show", `origin/${branch}:VERSION`));
    if (!remote) throw new Error("remote VERSION unreadable");
    let breaking = false;
    try {
      const log = await git(kit, "show", `origin/${branch}:CHANGELOG.md`);
      const start = log.indexOf(`## [${remote.join(".")}]`);
      const end = log.indexOf(`## [${local.join(".")}]`);
      breaking = start >= 0 && log.slice(start, end > start ? end : undefined).includes("BREAKING");
    } catch { /* changelog optional */ }
    const update = cmp(remote, local) > 0;
    state = { ts: Date.now(), update, line: `${local.join(".")} -> ${remote.join(".")}${breaking ? " [BREAKING]" : ""}`, breaking };
  } catch {
    return readJson(cachePath); // offline: fall back to the last known state, else null
  }

  try { mkdirSync(configDir, { recursive: true }); writeFileSync(cachePath, JSON.stringify(state)); } catch { /* best-effort */ }
  return state;
}
