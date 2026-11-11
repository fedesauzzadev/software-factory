// Migration 0001: schema 1 -> 2. BREAKING: status vocabulary.
// - `done` -> `shipped` (with evidence) — commit/deploy gates are "shipped", not "done".
// - `done` or `verified` WITHOUT any tests/functional/evidence -> `implemented`
//   (the honest ceiling without evidence). Idempotent: no match = no-op.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const scalar = (fm, key) => {
  const m = new RegExp(`^\\s*${key}:\\s*(.*)$`, "m").exec(fm);
  if (!m) return undefined;
  return m[1].replace(/\s+#.*$/, "").trim().replace(/^["']|["']$/g, "");
};
const hasEvidence = (fm) =>
  ["tests", "functional", "evidence"].some((k) => scalar(fm, k));

export async function migrate({ brainDir, dryRun }) {
  const dir = join(brainDir, "nodes");
  const plan = [];
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const raw = readFileSync(join(dir, f), "utf8");
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)?.[1];
    const status = fm ? scalar(fm, "status") : undefined;
    let next = null;
    if (status === "done") next = hasEvidence(fm) ? "shipped" : "implemented";
    else if (status === "verified" && !hasEvidence(fm)) next = "implemented";
    if (next) plan.push([f, status, next]);
  }
  if (dryRun) {
    for (const [f, from, to] of plan) console.log(`[0001] ${f}: ${from} -> ${to}`);
    console.log(`[0001] ${plan.length} node(s) affected${plan.length ? "" : " — nothing to do"}`);
    return;
  }
  for (const [f, , to] of plan) {
    const p = join(dir, f);
    writeFileSync(p, readFileSync(p, "utf8")
      .replace(/^status:\s*\S+.*$/m, `status: ${to}`));
  }
}
