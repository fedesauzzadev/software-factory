#!/usr/bin/env node
// brainloom validate-brain — structural validation of a brain directory.
// Usage: node validate-brain.mjs <brainDir>
// Exit 0 = valid (warnings allowed); exit 1 = errors found.
// Accepts inline lists (key: [a, b]) and block lists (key:\n  - a\n  - b).
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, basename, dirname } from "node:path";
import { pathToFileURL } from "node:url";

const ENUMS = {
  type: ["feature", "fix", "refactor", "chore", "spike"],
  size: ["S", "M", "L"],
  status: ["planned", "in-progress", "implemented", "verified", "shipped", "superseded"],
  reversibility: ["easy", "medium", "hard"],
};

function fmBlock(raw) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw);
  return m ? m[1] : null;
}
function scalar(fm, key) {
  const m = new RegExp(`^\\s*${key}:\\s*(.*)$`, "m").exec(fm);
  if (!m) return undefined;
  return m[1].replace(/\s+#.*$/, "").trim().replace(/^["']|["']$/g, "");
}
function list(fm, key) {
  const lines = fm.split("\n");
  const start = lines.findIndex(l => new RegExp(`^${key}:`).test(l));
  if (start < 0) return [];
  const rest = lines[start].slice(lines[start].indexOf(":") + 1).trim();
  if (rest.startsWith("[")) {
    return rest.replace(/^\[/, "").replace(/\].*$/, "").split(",")
      .map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
  }
  const items = [];
  for (const l of lines.slice(start + 1)) {
    const m = /^\s+-\s+(.*)$/.exec(l);
    if (!m) break; // block list ends at the first non-item line
    items.push(m[1].trim().replace(/^["']|["']$/g, ""));
  }
  return items.filter(Boolean);
}

export function validateBrain(brainDir) {
  const errors = [], warnings = [], stats = { nodes: 0, decisions: 0 };

  const configPath = join(brainDir, "config.yaml");
  if (!existsSync(configPath)) { errors.push("config.yaml missing"); return { errors, warnings, stats }; }
  const config = readFileSync(configPath, "utf8");
  const schema = parseInt(/^schema_version:\s*(\d+)/m.exec(config)?.[1] ?? "0", 10);
  const need = (re, msg) => { if (!re.test(config)) errors.push(`config.yaml: ${msg}`); };
  need(/^schema_version:\s*\d+/m, "schema_version (integer) missing");
  need(/^kit_version:\s*\d+\.\d+\.\d+/m, "kit_version (x.y.z) missing");
  need(/^language:\s*\S+/m, "language missing");
  need(/^max_parallel_agents:\s*\d+/m, "max_parallel_agents missing");
  need(/^ {2}max_diff_lines:\s*\d+/m, "limits.max_diff_lines missing");
  need(/^ {2}max_files:\s*\d+/m, "limits.max_files missing");

  const indexPath = join(brainDir, "index.md");
  if (!existsSync(indexPath)) errors.push("index.md missing");
  else if (readFileSync(indexPath, "utf8").split("\n").length > 150)
    warnings.push("index.md exceeds 150 lines — summarize or split");

  const projectRoot = dirname(brainDir);
  const nodesDir = join(brainDir, "nodes");
  const ids = new Set();
  if (existsSync(nodesDir))
    for (const f of readdirSync(nodesDir)) if (f.endsWith(".md")) ids.add(basename(f, ".md"));
  if (ids.size === 0) warnings.push("no nodes in brain/nodes/");

  for (const id of ids) {
    stats.nodes++;
    const raw = readFileSync(join(nodesDir, `${id}.md`), "utf8");
    const fm = fmBlock(raw);
    if (!fm) { errors.push(`${id}: no frontmatter block`); continue; }

    if (scalar(fm, "id") !== id) errors.push(`${id}: frontmatter id "${scalar(fm, "id")}" != filename`);
    for (const [key, vals] of Object.entries(ENUMS)) {
      const v = scalar(fm, key);
      if (key === "status" && v === "done" && schema < 2) {
        warnings.push(`${id}: status "done" is legacy (pre-schema 2) — run the kit migration (0001)`);
        continue;
      }
      if (!vals.includes(v)) errors.push(`${id}: ${key} "${v ?? "missing"}" invalid (expected ${vals.join(" | ")})`);
    }
    const status = scalar(fm, "status");
    const ac = list(fm, "acceptance_criteria");
    if (ac.length === 0) {
      if (status === "planned") warnings.push(`${id}: acceptance_criteria empty (write them before coding)`);
      else errors.push(`${id}: acceptance_criteria empty but status is ${status}`);
    }
    for (const key of ["depends_on", "affects", "replaces"])
      for (const ref of list(fm, key))
        if (!ids.has(ref)) errors.push(`${id}: ${key} -> ${ref} has no node file`);
    for (const d of list(fm, "decisions")) {
      if (!existsSync(join(brainDir, "decisions", `${d}.md`))) warnings.push(`${id}: decision ${d} not found`);
      else stats.decisions++;
    }
    const ver = { tests: scalar(fm, "tests"), functional: scalar(fm, "functional"), evidence: scalar(fm, "evidence") };
    if ((status === "verified" || status === "shipped") && !Object.values(ver).some(Boolean)) {
      if (schema >= 2) errors.push(`${id}: status ${status} but verification fields are empty — demote to implemented or add evidence (command + result)`);
      else warnings.push(`${id}: ${status} without evidence (legacy brain) — migration 0001 will demote it to implemented`);
    }
    if ((status === "verified" || status === "shipped") && list(fm, "verify").length === 0)
      warnings.push(`${id}: status ${status} but verify recipe empty — write the exact command sequence on first verification`);
    const level = scalar(fm, "level");
    if (level && !["smoke", "full"].includes(level))
      errors.push(`${id}: verification.level "${level}" invalid (expected smoke | full)`);
    if ((status === "verified" || status === "shipped") && !level)
      warnings.push(`${id}: verification.level missing — declare smoke (orchestration/spec deltas) or full (product code)`);
    // agents write evidence paths relative to either the brain dir or the
    // project root; accept both — the file is checked against disk, not form
    if (ver.evidence && !existsSync(join(brainDir, ver.evidence)) && !existsSync(join(projectRoot, ver.evidence)))
      errors.push(`${id}: evidence "${ver.evidence}" missing`);
    for (const ptr of list(fm, "code")) {
      const file = ptr.split("->")[0].trim();
      if (!existsSync(join(projectRoot, file))) errors.push(`${id}: code pointer "${file}" does not exist`);
    }
    const body = raw.split(/^---\s*$/m).slice(2).join("---");
    if (body.split("\n").length > 40) warnings.push(`${id}: body exceeds 40 lines — split or summarize`);
  }

  return { errors, warnings, stats };
}

async function main() {
  const brainDir = process.argv[2];
  if (!brainDir || !existsSync(brainDir)) {
    console.error("usage: validate-brain.mjs <brainDir>");
    process.exit(2);
  }
  const { errors, warnings, stats } = validateBrain(brainDir);
  console.log(`brain: ${brainDir} — ${stats.nodes} node(s), ${stats.decisions} decision(s)`);
  for (const e of errors) console.log(`ERROR ${e}`);
  for (const w of warnings) console.log(`WARN  ${w}`);
  console.log(errors.length ? "INVALID" : `valid${warnings.length ? ` (${warnings.length} warning(s))` : ""}`);
  process.exit(errors.length ? 1 : 0);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) await main();
