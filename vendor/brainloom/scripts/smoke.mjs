#!/usr/bin/env node
// brainloom smoke — kit self-check + skill verification runner.
// Usage: node smoke.mjs [--agent] [--skill <name>] [--agent-cmd "<cmd> [args]"]
//
// Structural mode (default — CI-safe, offline, no agent):
//   1. every core/skills/*/SKILL.md declares a "## Verification" contract
//      with a Fixture that exists (and whose brain/ still validates),
//      with well-formed `expect:` lines;
//   2. every shipped .mjs parses (node --check);
//   3. any .ps1/.cmd/.bat is ASCII-only or UTF-8 with BOM — Windows
//      PowerShell 5.1 reads BOM-less UTF-8 as ANSI and mangles non-ASCII.
//
// Agent mode (--agent): behavioral check of one skill. Copies the fixture to a
// temp dir, runs the contract's Task through the harness (default
// `opencode run --auto "<task>"` with cwd = fixture copy; override with
// --agent-cmd "node tests/fake-agent.mjs" for offline plumbing tests), then
// asserts the contract's expect lines against the resulting artifacts:
//   expect: file <relpath>         — path exists in the fixture copy
//   expect: grep <relpath> <text>  — file content contains text
//   expect: valid <brainRelDir>    — validate-brain reports no errors
// Contracts without a Task: line are manual drills — structural mode still
// checks them, agent mode lists them as skipped.
// Exit 0 = all checks pass; 1 = failures.
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { validateBrain } from "./validate-brain.mjs";

const kitRoot = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : null; };
const agentMode = args.includes("--agent");
const only = flag("skill");
const agentCmd = flag("agent-cmd");

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === ".git" || e === "node_modules" || e === ".backup") continue;
    const p = join(dir, e);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

function contracts() {
  const skillsDir = join(kitRoot, "core", "skills");
  return readdirSync(skillsDir).map((name) => {
    const raw = readFileSync(join(skillsDir, name, "SKILL.md"), "utf8");
    const at = /^## Verification\s*$/m.exec(raw)?.index;
    const body = at === undefined ? null : raw.slice(at).split(/\n(?=## )/)[0];
    const line = (re) => (body ? re.exec(body)?.[1]?.trim() ?? null : null);
    return {
      name,
      body,
      fixture: line(/^Fixture:\s*(.+)$/m),
      task: line(/^Task:\s*(.+)$/m),
      expects: body ? [...body.matchAll(/^expect:\s*(.+)$/mg)].map((m) => m[1].trim()) : [],
    };
  });
}

function structural(skills, failures) {
  for (const c of skills) {
    if (!c.body) { failures.push(`${c.name}: no "## Verification" section`); continue; }
    if (!c.fixture) { failures.push(`${c.name}: Verification section has no Fixture: line`); continue; }
    const fixtureDir = join(kitRoot, c.fixture);
    if (!existsSync(fixtureDir)) { failures.push(`${c.name}: fixture ${c.fixture} not found`); continue; }
    const brainDir = join(fixtureDir, "brain");
    if (existsSync(brainDir)) {
      const { errors } = validateBrain(brainDir);
      if (errors.length) failures.push(`${c.name}: fixture brain invalid:\n  ${errors.join("\n  ")}`);
    }
    for (const e of c.expects)
      if (!/^(file|grep|valid)\s+/.test(e)) failures.push(`${c.name}: unknown expect op in "${e}"`);
  }
  for (const f of walk(kitRoot).filter((f) => f.endsWith(".mjs")))
    try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); }
    catch (e) { failures.push(`syntax: ${relative(kitRoot, f)} — ${String(e.stderr).split("\n")[0]}`); }
  for (const f of walk(kitRoot).filter((f) => /\.(ps1|cmd|bat)$/i.test(f))) {
    const buf = readFileSync(f);
    const ok = (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) || buf.every((b) => b < 0x80);
    if (!ok) failures.push(`encoding: ${relative(kitRoot, f)} must be ASCII-only or UTF-8 with BOM (PS 5.1 reads BOM-less UTF-8 as ANSI)`);
  }
}

function checkExpect(e, root) {
  const m = /^(file|grep|valid)\s+(.+)$/.exec(e);
  if (!m) return `malformed expect "${e}"`;
  const [, op, rest] = m;
  if (op === "file") return existsSync(join(root, rest)) ? null : `file missing: ${rest}`;
  if (op === "valid") {
    const { errors } = validateBrain(join(root, rest));
    return errors.length ? `brain invalid: ${errors.join("; ")}` : null;
  }
  const sp = rest.indexOf(" ");
  if (sp < 0) return `malformed grep expect "${e}" (needs <path> <text>)`;
  const path = rest.slice(0, sp), text = rest.slice(sp + 1).replace(/^["']|["']$/g, "");
  const p = join(root, path);
  if (!existsSync(p)) return `file missing: ${path}`;
  return readFileSync(p, "utf8").includes(text) ? null : `${path} does not contain: ${text}`;
}

function runAgentTask(c, fixtureDir) {
  const tmp = mkdtempSync(join(tmpdir(), "brainloom-smoke-"));
  cpSync(fixtureDir, tmp, { recursive: true });
  const prompt = `Verify the brainloom skill "${c.name}". Load the skill (installed globally) and follow it exactly for this task: ${c.task} Non-interactive: do not ask questions; apply the skill's documented defaults.`;
  try {
    if (agentCmd) {
      const sp = agentCmd.indexOf(" ");
      // relative paths (executable and args) resolve against the invoking cwd, not the fixture copy
      const here = (p) => existsSync(join(process.cwd(), p)) ? join(process.cwd(), p) : p;
      const rest = (sp < 0 ? [] : agentCmd.slice(sp + 1).split(" ").filter(Boolean))
        .map((a) => a.startsWith("-") ? a : here(a));
      let cmd = sp < 0 ? agentCmd : agentCmd.slice(0, sp);
      if (!existsSync(cmd)) cmd = here(cmd);
      execFileSync(cmd, [...rest, prompt], { cwd: tmp, stdio: "inherit" });
    } else if (process.platform === "win32") {
      // .cmd shims need a shell on Windows; --auto: writes go to a throwaway
      // temp copy, so auto-approve is safe here; --standalone: a private
      // server dies with the child, releasing the cwd handle so cleanup can
      // delete the temp dir (the shared background service holds it forever);
      // keep the prompt quote-free
      execFileSync("opencode", ["run", "--auto", "--standalone", `"${prompt.replace(/"/g, "'")}"`], { cwd: tmp, stdio: "inherit", shell: true });
    } else {
      execFileSync("opencode", ["run", "--auto", "--standalone", prompt], { cwd: tmp, stdio: "inherit" });
    }
    return c.expects.map((e) => checkExpect(e, tmp)).filter(Boolean).map((f) => `${c.name}: ${f}`);
  } finally {
    // best-effort cleanup: Windows EPERMs if the child still holds a handle
    try { rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); }
    catch { console.log(`warn: could not clean up ${tmp}`); }
  }
}

let skills = contracts();
if (only) {
  skills = skills.filter((c) => c.name === only);
  if (!skills.length) { console.error(`no such skill: ${only}`); process.exit(2); }
}
const failures = [];

if (!agentMode) {
  structural(skills, failures);
  for (const c of skills)
    console.log(`${c.body ? "ok  " : "MISS"} ${c.name} — ${c.task ? "agent-runnable contract" : "manual contract"} on ${c.fixture ?? "?"}`);
  console.log(failures.length ? `FAIL (${failures.length})` : "smoke: structural pass");
  process.exit(failures.length ? 1 : 0);
}

for (const c of skills) {
  if (!c.task) { console.log(`skip ${c.name}: manual contract (no Task line)`); continue; }
  if (!c.fixture || !existsSync(join(kitRoot, c.fixture))) { failures.push(`${c.name}: fixture missing`); continue; }
  console.log(`\n=== ${c.name} — agent run on ${c.fixture}`);
  failures.push(...runAgentTask(c, join(kitRoot, c.fixture)));
}
for (const f of failures) console.log(`FAIL ${f}`);
console.log(failures.length ? `FAIL (${failures.length})` : "smoke: agent pass");
process.exit(failures.length ? 1 : 0);
