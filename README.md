# NSDD Software Factory

[![CI](https://github.com/fedesauzzadev/software-factory/actions/workflows/ci.yml/badge.svg)](https://github.com/fedesauzzadev/software-factory/actions/workflows/ci.yml)

Fábrica de software ágil autónoma para OpenCode, construida sobre [brainloom](https://github.com/) (metodología NSDD). El usuario es el **Negocio**: entrega un requerimiento y la fábrica —Product Owner, Tech Lead, Devs y QA (subagents con roles propios)— lo construye end-to-end hasta una **review gate** donde el Negocio aprueba el MVP y el roadmap de entregas de valor futuras.

## Qué incluye

| Pieza | Rol |
|---|---|
| Comando `/factory` | Entrada del Negocio: `/factory <requerimiento>` arranca la corrida; `/factory` a secas = modo estado |
| Skill `software-factory` | Orquestador: intake → PO → Tech Lead → Scrum Master → Build → QA → Dashboard/Oficina → Review gate |
| Agent `factory/po` | Dueño del valor: spec, backlog con AC, corte MVP, roadmap |
| Agent `factory/tech-lead` | Dueño de la excelencia técnica: stack, arquitectura, ADRs, NFRs, desbloqueo |
| Agent `factory/ux` | UI/UX: user flows, wireframes low-fi, AC de usabilidad/accesibilidad (productos con interfaz) |
| Agent `factory/designer` | Super diseñadora frontend: design system con tokens, capa visual de alto impacto, accesible |
| Agent `factory/scrum-master` | Dueño del ritmo: board de sprints vivo (`factory/sprints.md`), desvíos, agenda de gates |
| Agent `factory/dev` | Construye slices end-to-end con tests y evidencia real de verificación |
| Agent `factory/qa` | Adversarial: tests, seguridad, resiliencia, performance, DoD vendible |
| **brainloom incluido** (`vendor/brainloom/`) | `brain/` del proyecto: nodos, decisiones (ADRs), evidencia, aprendizajes persistentes — se instala junto con la fábrica |

## Instalar

**Una línea** (descarga e instala solo — requiere git en PATH):

```powershell
# Windows (PowerShell)
irm https://raw.githubusercontent.com/fedesauzzadev/software-factory/main/install.ps1 | iex
```

```bash
# Linux / macOS (bash)
curl -fsSL https://raw.githubusercontent.com/fedesauzzadev/software-factory/main/install.sh | bash
```

**O desde el clon** (para desarrollar el kit):

```bash
git clone https://github.com/fedesauzzadev/software-factory
cd software-factory
./install.sh          # Windows: .\install.ps1   (aceptan -Target/--target para probar en otra carpeta)
```

Instala la skill `software-factory`, los agents `factory/*`, el comando `/factory` **y brainloom** (memoria de la fábrica, vendido en `vendor/brainloom/`) en `~/.config/opencode/`. Desinstalar: `uninstall.ps1` / `uninstall.sh` (remueve solo la fábrica; brainloom queda, es infra compartida). Requisito único: **node** en PATH (para brainloom).

## Usar

El Negocio le habla a la fábrica con un comando:

```
/factory Necesito una API que genere facturas PDF desde JSON, en Node, vendible a contadores
```

Eso carga la skill `software-factory` y arranca la corrida completa en el directorio actual (o el que digas). Sin argumentos — `/factory` — entra en **modo estado**: regenera la oficina y el dashboard del proyecto actual con el avance del momento (fase, nodos, hallazgos, gates pendientes).

La fábrica entonces:

1. Registra el intake (incluye stack: sugerido → el Tech Lead evalúa y puede contraproponer; impuesto → se cumple).
2. Si no hay `brain/`, inicializa brainloom.
3. PO → spec + backlog (corte MVP ≤ 4 historias) + roadmap V0/V1/V2.
4. Tech Lead → plan técnico, ADRs, NFRs medibles, sprints.
5. Devs → slices con AC primero, tests, verificación corrida con evidencia. **Anti-bloqueo**: 3 intentos → escalado al Tech Lead → workaround → ADR + aprendizaje.
6. QA → suite completa, checklist seguridad/resiliencia/perf, DoD vendible, veredicto SHIP/NO-SHIP.
7. Dashboard visual `factory/dashboard.html` (kanban, roadmap, calidad, bloqueos, decisiones) + oficina visual `factory/office.html` (piso de fábrica: agentes en sus puestos, estados en vivo, actividad del día).
8. **Review gate**: se detiene y presenta al Negocio MVP + verificación + roadmap + preguntas. Solo avanza con aprobación explícita.

## Reglas de la casa

- Nada está "done" sin evidencia de verificación corrida (regla brainloom).
- Nadie se frena sin 3 intentos + escalado + workaround documentado.
- Todo aprendizaje queda en `brain/` y `factory/learnings.md`: la fábrica aprende.
- Sin DoD comercial (README, LICENSE, tests verdes, sin secrets) no hay entrega: código no vendible = fábrica despedida.

## Hacer crecer la fábrica

El kit está pensado para evolucionar. Reglas del crecimiento:

1. **Nuevo rol** → un markdown en `agents/factory/<rol>.md` (frontmatter `mode: subagent` + description + carta de rol). Cablealo en `SKILL.md` en la fase que le toque y agregalo a la tabla del README.
2. **Nueva regla de calidad** → `references/security.md` (QA y TL ya la consumen).
3. **Nueva vista visual** → template en `templates/` + sus marcadores documentados en `references/dashboard.md`.
4. **Aprender de una corrida** → los aprendizajes genéricos de `factory/learnings.md` de cada proyecto se proponen como cambios al kit (retro): si el Negocio los aprueba, entran acá y toda fábrica futura mejora.
5. **Cambios** → corré `node scripts/validate-kit.mjs` antes de pushear (la CI de GitHub lo verifica en Ubuntu y Windows junto a install/uninstall). Subí `VERSION` + entrada en `CHANGELOG.md`.
6. **Actualizar brainloom** → reemplazá el contenido de `vendor/brainloom/` por la nueva versión del kit (MIT), subí `VERSION` + CHANGELOG, y re-ejecutá el instalador (es idempotente; si hay colisiones con tu copia local, decidí vos con `--force`).

Estructura del repo:

```
software-factory/
├── install.ps1 / install.sh / uninstall.*     # instaladores portátiles (con bootstrap de una línea)
├── commands/factory.md                        # /factory — entrada del Negocio
├── agents/factory/                            # po, ux, tech-lead, scrum-master, designer, dev, qa
├── skills/software-factory/                   # skill orquestadora
│   ├── SKILL.md
│   ├── references/                            # workflow, security, dashboard
│   └── templates/                             # dashboard.html, office.html
├── vendor/brainloom/                          # memoria de la fábrica (MIT) — se instala junto
├── scripts/validate-kit.mjs                   # integridad (local + CI)
└── .github/workflows/ci.yml                   # CI: valida + instala + desinstala (ubuntu/windows)
```
