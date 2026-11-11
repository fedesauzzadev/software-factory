#!/usr/bin/env node
// Verifica el layout instalado del kit. CI y uso local.
// Uso: node scripts/verify-install.mjs <target> [--removed]
import { existsSync } from "node:fs";
import { join } from "node:path";

const [target, mode] = process.argv.slice(2);
if (!target) { console.error("Uso: node verify-install.mjs <target> [--removed]"); process.exit(2); }
const removed = mode === "--removed";

const files = [
  "skills/software-factory/SKILL.md",
  "skills/software-factory/references/workflow.md",
  "skills/software-factory/references/security.md",
  "skills/software-factory/references/dashboard.md",
  "skills/software-factory/templates/dashboard.html",
  "skills/software-factory/templates/office.html",
  "commands/factory.md",
  "agents/factory/po.md", "agents/factory/tech-lead.md", "agents/factory/ux.md",
  "agents/factory/scrum-master.md", "agents/factory/designer.md",
  "agents/factory/dev.md", "agents/factory/qa.md",
];

let errors = 0;
for (const f of files) {
  const exists = existsSync(join(target, f));
  const good = removed ? !exists : exists;
  console.log(`  ${good ? "✓" : "✗"} ${f}${removed ? " ausente" : ""}`);
  if (!good) errors++;
}
console.log(errors ? `INVALID (${errors} error(es))` : "VALID");
process.exit(errors ? 1 : 0);
