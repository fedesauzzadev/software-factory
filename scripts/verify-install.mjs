#!/usr/bin/env node
// Verifica el layout instalado del kit. CI y uso local.
// Uso: node scripts/verify-install.mjs <target> [--removed]
// --removed verifica solo los archivos de la fábrica (brainloom es compartido y no se desinstala junto).
import { existsSync } from "node:fs";
import { join } from "node:path";

const [target, mode] = process.argv.slice(2);
if (!target) { console.error("Uso: node verify-install.mjs <target> [--removed]"); process.exit(2); }
const removed = mode === "--removed";

const factoryFiles = [
  "skills/software-factory/SKILL.md",
  "skills/software-factory/references/workflow.md",
  "skills/software-factory/references/security.md",
  "skills/software-factory/references/dashboard.md",
  "skills/software-factory/templates/dashboard.html",
  "skills/software-factory/templates/office.html",
  "commands/factory.md",
  "agents/factory/po.md", "agents/factory/tech-lead.md", "agents/factory/ux.md",
  "agents/factory/scrum-master.md", "agents/factory/designer.md",
  "agents/factory/dev.md", "agents/factory/qa.md", "agents/factory/artist.md",
];
// Layout instalado por brainloom 0.8.0
const brainloomFiles = [
  ...["adopt", "build-slice", "init-brain", "kit-update", "memory-update",
     "plan-project", "reconcile", "small-change", "triage", "verify"]
    .map(s => `skills/${s}/SKILL.md`),
  ...["adopt", "build-slice", "fix", "init-brain", "kit-update",
     "plan-project", "reconcile", "triage", "verify"].map(c => `commands/${c}.md`),
  "agents/brainloom/planner.md", "agents/brainloom/refuter.md",
  "agents/brainloom/scout.md", "agents/brainloom/verifier.md",
  "plugins/brainloom/index.js", "plugins/brainloom/lib.js",
  "brainloom.kit.json",
];
const files = removed ? factoryFiles : [...factoryFiles, ...brainloomFiles];

let errors = 0;
for (const f of files) {
  const exists = existsSync(join(target, f));
  const good = removed ? !exists : exists;
  console.log(`  ${good ? "✓" : "✗"} ${f}${removed ? " ausente" : ""}`);
  if (!good) errors++;
}
console.log(errors ? `INVALID (${errors} error(es))` : "VALID");
process.exit(errors ? 1 : 0);
