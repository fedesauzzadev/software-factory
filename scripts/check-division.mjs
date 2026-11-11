#!/usr/bin/env node
// Verifica un playbook de división sintetizada (smoke de Fase 0.5, v0.4.0).
// Uso: node scripts/check-division.mjs <division.md>
import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) { console.error("Uso: node check-division.mjs <division.md>"); process.exit(2); }
const t = readFileSync(file, "utf8");
let errors = 0;
const chk = (ok, msg) => { console.log(`  ${ok ? "✓" : "✗"} ${msg}`); if (!ok) errors++; };

for (const sec of ["## Detección", "## Ajustes de equipo", "## Mapa de skills", "## Gates de dominio", "## DoD de dominio", "## Artefactos de dominio"])
  chk(t.includes(sec), `sección ${sec.replace("## ", "")}`);

// El mapa no debe citar skills concretas salvo declarar que aplica inline
const citaSkills = /Cargá las skills:\s*[^\s—-]/.test(t) && /Skills a cargar/.test(t);
chk(!citaSkills, "no cita skills por nombre cuando el entorno no tiene del dominio");

// Gates observables: lenguaje verificable, no aspiracional
chk(/(JAMÁS|nunca|NO |≤|=\s?\d|round-trip|idempoten)/i.test(t), "gates en lenguaje observable/verificable");

console.log(errors ? "INVALID" : "VALID");
process.exit(errors ? 1 : 0);
