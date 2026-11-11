// Migration 0001: schema 1 -> 2. BREAKING: node frontmatter `verification:` -> `proof:`.
// TEST FIXTURE for the update drill. Idempotent: no match = no-op.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export async function migrate({ brainDir, dryRun }) {
  const dir = join(brainDir, "nodes");
  const targets = readdirSync(dir).filter(f =>
    f.endsWith(".md") && /^verification:$/m.test(readFileSync(join(dir, f), "utf8")));
  if (dryRun) {
    console.log(`[0001] rename verification: -> proof: in ${targets.length} node(s): ${targets.join(", ") || "none"}`);
    return;
  }
  for (const f of targets) {
    const p = join(dir, f);
    writeFileSync(p, readFileSync(p, "utf8").replace(/^verification:$/m, "proof:"));
  }
}
