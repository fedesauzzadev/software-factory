// Migration 0002: schema 2 -> 3. TEST FIXTURE ONLY — fails mid-apply on purpose.
export async function migrate({ brainDir, dryRun }) {
  if (dryRun) {
    console.log("[0002] TEST FIXTURE: simulates a migration that crashes during apply");
    return;
  }
  throw new Error("forced failure for rollback drill");
}
