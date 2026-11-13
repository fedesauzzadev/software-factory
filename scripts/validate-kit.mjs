#!/usr/bin/env node
// Valida la integridad del kit NSDD Software Factory. CI y uso local.
// Uso: node scripts/validate-kit.mjs
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
let errors = [];
const ok = (m) => console.log(`  ✓ ${m}`);
const bad = (m) => { errors.push(m); console.error(`  ✗ ${m}`); };

// 1. Archivos requeridos
const required = [
  "skills/software-factory/SKILL.md",
  "skills/software-factory/references/workflow.md",
  "skills/software-factory/references/security.md",
  "skills/software-factory/references/dashboard.md",
  "skills/software-factory/references/divisions.md",
  "skills/software-factory/templates/dashboard.html",
  "skills/software-factory/templates/office.html",
  "commands/factory.md",
  "README.md", "CHANGELOG.md", "VERSION", "LICENSE",
  "install.sh", "uninstall.sh", "install.ps1", "uninstall.ps1",
];
const agents = ["po", "tech-lead", "ux", "scrum-master", "designer", "dev", "qa", "artist"];
required.push(...agents.map(a => `agents/factory/${a}.md`));
// brainloom vendored (memoria de la fábrica) — layout 0.8.0
required.push(
  "vendor/brainloom/VERSION", "vendor/brainloom/LICENSE",
  "vendor/brainloom/adapters/opencode/install.mjs",
  "vendor/brainloom/scripts/validate-brain.mjs",
  "vendor/brainloom/scripts/smoke.mjs",
  "vendor/brainloom/adapters/opencode/agents/brainloom/planner.md",
  "vendor/brainloom/adapters/opencode/agents/brainloom/refuter.md",
  "vendor/brainloom/adapters/opencode/agents/brainloom/scout.md",
  "vendor/brainloom/adapters/opencode/agents/brainloom/verifier.md",
  ...["adopt", "build-slice", "init-brain", "kit-update", "memory-update",
     "plan-project", "reconcile", "small-change", "triage", "verify"]
    .map(s => `vendor/brainloom/core/skills/${s}/SKILL.md`),
);

console.log("Archivos requeridos:");
for (const f of required) existsSync(join(root, f)) ? ok(f) : bad(`FALTA: ${f}`);

// 2. Frontmatter de agents
console.log("Agents (mode + description):");
for (const a of agents) {
  const t = readFileSync(join(root, "agents/factory", `${a}.md`), "utf8");
  const fm = t.split("---")[1] ?? "";
  fm.includes("mode: subagent") ? ok(`${a}: mode subagent`) : bad(`${a}: sin 'mode: subagent'`);
  /description:\s*\S/.test(fm) ? ok(`${a}: description`) : bad(`${a}: sin description`);
}

// 3. La skill: frontmatter + fases
console.log("Skill orquestadora:");
const skill = readFileSync(join(root, "skills/software-factory/SKILL.md"), "utf8");
(/name:\s*\S/.test(skill) && /description:\s*\S/.test(skill.split("---")[1] ?? "")) ? ok("frontmatter name+description") : bad("SKILL.md frontmatter incompleto");
for (const fase of ["Fase 0", "Fase 1", "Fase 1.5", "Fase 2", "Fase 2.5", "Fase 3", "Fase 4", "Fase 5", "Fase 6"]) {
  skill.includes(fase) ? ok(`${fase} documentada`) : bad(`SKILL.md sin sección ${fase}`);
}

// 4. Marcadores de templates: cada {{X}} documentado en dashboard.md debe existir en su template
console.log("Marcadores de templates:");
const dashDoc = readFileSync(join(root, "skills/software-factory/references/dashboard.md"), "utf8");
const markers = [...dashDoc.matchAll(/\{\{([A-Z_]+)\}\}/g)].map(m => m[1]);
const unique = [...new Set(markers)];
for (const m of unique) {
  const inDash = readFileSync(join(root, "skills/software-factory/templates/dashboard.html"), "utf8").includes(`{{${m}}}`);
  const inOffice = readFileSync(join(root, "skills/software-factory/templates/office.html"), "utf8").includes(`{{${m}}}`);
  inDash || inOffice ? ok(`{{${m}}} presente en template`) : bad(`{{${m}}} documentado pero ausente en templates`);
}
if (!unique.length) bad("dashboard.md no documenta marcadores");

// Divisiones: cada playbook presente en divisions/ (caché) debe tener las secciones del formato.
// La mecánica es síntesis automática; los playbooks del repo son caché/ejemplo, ninguno obligatorio.
console.log("Divisiones (caché — opcionales, formato obligatorio):");
const divDir = join(root, "skills/software-factory/divisions");
const divisionFiles = existsSync(divDir) ? readdirSync(divDir).filter(f => f.endsWith(".md")) : [];
if (!divisionFiles.length) console.log("  (sin caché — la fábrica sintetiza por requerimiento)");
for (const f of divisionFiles) {
  const t = readFileSync(join(divDir, f), "utf8");
  for (const sec of ["## Detección", "## Ajustes de equipo", "## Gates de dominio", "## DoD de dominio", "## Artefactos de dominio"]) {
    t.includes(sec) ? ok(`${f}: ${sec.replace("## ", "")}`) : bad(`${f}: sin sección ${sec}`);
  }
}

// 5. Comando /factory
console.log("Comando:");
const cmd = readFileSync(join(root, "commands/factory.md"), "utf8");
cmd.includes("$ARGUMENTS") ? ok("/factory usa $ARGUMENTS") : bad("commands/factory.md sin $ARGUMENTS");

// 6. Anti-huérfanos: cada skill brainloom que la fábrica referencia debe existir en el vendor.
// Si un update del kit la quita, este check falla y obliga a adaptar o migrar la referencia.
console.log("Skills brainloom referenciadas (anti-huérfanos):");
const factoryDocs = [
  "skills/software-factory/SKILL.md",
  "skills/software-factory/references/workflow.md",
  ...agents.map(a => `agents/factory/${a}.md`),
];
const docsText = factoryDocs.map(f => readFileSync(join(root, f), "utf8")).join("\n");
const brainloomSkills = readdirSync(join(root, "vendor/brainloom/core/skills"));
for (const s of brainloomSkills) {
  if (!docsText.includes(`\`${s}\``)) continue; // no referenciada: basta el check de presencia del punto 1
  existsSync(join(root, "vendor/brainloom/core/skills", s, "SKILL.md"))
    ? ok(`\`${s}\` referenciada y presente en el vendor`)
    : bad(`HUÉRFANA: la fábrica referencia \`${s}\` pero el vendor no la trae — adaptá o migrá`);
}
// Referencias a skills que el vendor YA no tiene: buscar nombres backtick-eados conocidos
const knownSkillNames = ["adopt", "build-slice", "init-brain", "kit-update", "memory-update", "plan-project", "reconcile", "small-change", "triage", "verify"];
for (const s of knownSkillNames) {
  if (brainloomSkills.includes(s)) continue;
  docsText.includes(`\`${s}\``) && bad(`HUÉRFANA: \`${s}\` referenciada pero ausente del vendor (el kit la quitó)`);
}

// 7. Versionado
console.log("Versionado:");
const v = readFileSync(join(root, "VERSION"), "utf8").trim();
/^\d+\.\d+\.\d+$/.test(v) ? ok(`VERSION ${v} semver`) : bad(`VERSION inválida: '${v}'`);
const chlog = readFileSync(join(root, "CHANGELOG.md"), "utf8");
chlog.includes(v) ? ok(`CHANGELOG contiene ${v}`) : bad(`CHANGELOG sin entrada ${v}`);

console.log(errors.length ? `\nINVALID: ${errors.length} error(es)` : "\nVALID: kit íntegro");
process.exit(errors.length ? 1 : 0);
