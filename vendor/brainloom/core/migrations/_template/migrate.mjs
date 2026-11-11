// Migration NNNN: schema NNNN -> NNNN+1. <one line>
// Plain Node, standard library only. See ../README.md for the rules.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export async function migrate({ brainDir, dryRun }) {
  // 1. Collect planned changes (scan brainDir).
  // 2. dryRun: console.log(`[NNNN] <plan for humans>`); return; — change NOTHING.
  // 3. Apply. Must be idempotent (re-running on a migrated brain = no-op).
  //    Throw on any failure — the runner rolls back from its backup.
  throw new Error("template — copy this dir and implement migrate()");
}
