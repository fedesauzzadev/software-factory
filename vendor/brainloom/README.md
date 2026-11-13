# brainloom

**Criterion, limits, and memory for AI-assisted development.**

Working with an agent gets out of hand fast: it builds giant things in one pass
that cost more to debug than to write, duplicates code, forgets every decision,
and calls things "done" because tests passed — not because they work.
brainloom packages the discipline that fixes that: a versioned, tool-agnostic
methodology kit you install once and use in any project.

- **Brain** — a persistent markdown graph per project: nodes with acceptance
  criteria, decisions, and *pointers* into the code (the map, not the territory).
- **Triage** — every task is classified by impact radius (FIX/S · M · L) before
  any code is written, with a hard anti-monster limit that stops runaway diffs.
- **Vertical slices** — thin end-to-end increments; slice 1 is always a walking
  skeleton that validates the architecture.
- **Real verification** — done means: criteria met, tests run, the thing
  actually executed, and an independent read-only verifier that tried to
  *refute* it.

Tool-agnostic core (`/core`), adapters per harness. Only the OpenCode adapter
exists today; the core never depends on it.

---

## Quickstart (5 minutes)

**Prerequisites:** [git](https://git-scm.com), [Node.js](https://nodejs.org)
(18+), and a harness with skill support (OpenCode 2.x for the bundled adapter).

```bash
# 1. Clone the kit anywhere (it is global, not per-project)
git clone https://github.com/fedesauzzadev/brainloom.git
cd brainloom

# 2. Install into your OpenCode global config (never overwrites foreign files)
node adapters/opencode/install.mjs
```

**3. Onboard a project** — open your project in OpenCode and run:

```
/init-brain
```

It discovers your test/lint/build/run commands, asks what it can't infer
(language, model levels for `strong`/`balanced`/`fast`), generates `brain/`
plus a short `AGENTS.md` section, and validates itself. Existing codebase? It
offers `adopt` to map it by areas.

**4. Work normally.** Every task goes through triage — in natural language or
via commands:

| Command | What it does |
|---|---|
| `/triage` | Classify a task by impact radius and route it |
| `/plan-project` | Whole idea → ordered vertical slices → roadmap (after your OK) |
| `/build-slice` | Build the current slice: criteria first, thin, verified |
| `/fix` | Triage + encapsulated small-change flow for a reported issue |
| `/verify` | Real verification: criteria, tests, execution, refutation |
| `/reconcile` | Repair drift between brain and code |
| `/adopt` | Map an existing codebase into the brain, area by area |
| `/init-brain` | Onboard the current project |
| `/kit-update` | Update the kit and migrate brains (with confirmation) |

## Daily use, three ways

**New project** — describe the whole idea: *"build me a tagged notes CLI"*.
Triage routes to `plan-project`: you get a slice proposal (slice 1 is a
walking skeleton), approve it, then `/build-slice` — each node gets acceptance
criteria *before* code, gets built thin, and gets verified by actually running
it plus an independent verifier subagent.

**Medium task** — *"add tag filtering to the notes list"*. Triage says M; it
becomes a node in the current slice with criteria first; build-slice grows the
skeleton; the verifier tries to refute it before anything is `done`.

**A fix** — *"listing shows notes in the wrong order"*. `/fix` classifies it
FIX/S, writes observable criteria, fixes encapsulated (no drive-by refactors),
verifies for real, and updates the brain. If the "fix" turns out to touch
shared contracts, the flow stops and reclassifies — that's the point.

## Updates

The kit is versioned (SemVer). On session start, a small plugin checks the
remote (git fetch only, cached 24 h, offline-tolerant, no telemetry) and if
there's a new version you get **one line** naming it. `/kit-update` then shows
the changelog with `[BREAKING]` highlights, asks, pulls, reinstalls, and runs
brain migrations — dry-run first, backup before each step, validation after,
automatic rollback on failure. A brain never becomes unusable after an update.

Opt out per project: `update_check.enabled: false` in `brain/config.yaml`.

## Repo layout

```
/core       skills, brain templates, migrations — tool-agnostic (English)
/adapters/opencode   installer, agents (planner/verifier/scout), commands, notice plugin
/scripts    check-update · validate-brain · migrate · smoke (Node stdlib, no deps)
/tests      fixtures: sample brain, empty project, migration drills, offline fake agent
```

Everything inside the kit is English; this README is bilingual (EN/ES). Brain
language is configurable per project (`language` in `brain/config.yaml`).
Supported platforms: Windows, macOS, Linux.

## Development

The kit is held to its own standard: **everything gets verified** — no claim
of "done / works / passes" without a command that actually ran and its
observed result.

- Every skill carries a `## Verification` contract (fixture + task + expected
  artifacts). Run `node scripts/smoke.mjs` before versioning; `--agent` runs
  the contracts through the harness on a throwaway fixture copy.
- CI is bash-pinned and runs the structural smoke plus the offline agent
  plumbing on every push (ubuntu/macos/windows). Verify any `run:` change
  locally under bash before pushing.
- Kit scripts are plain Node `.mjs`, stdlib only, cross-platform. Anything
  else must be ASCII-only or UTF-8 with BOM (Windows PowerShell 5.1 reads
  BOM-less UTF-8 as ANSI) — `smoke.mjs` enforces it.

See [CONTRIBUTING](CONTRIBUTING.md) for the full rules.

## License

[MIT](LICENSE) — contributions welcome, see [CONTRIBUTING](CONTRIBUTING.md).

---

# brainloom (Español)

**Criterio, límites y memoria para el desarrollo asistido por IA.**

Trabajar con un agente se descontrola rápido: construye cosas gigantes de una
pasada que cuestan más debuggear que escribir, duplica código, olvida cada
decisión, y da por "hecho" algo porque pasó los tests — no porque funcione.
brainloom empaqueta la disciplina que lo corrige: un kit de metodología
versionado y agnóstico de herramienta, que instalás una vez y usás en
cualquier proyecto.

- **Brain** — grafo de markdown persistente por proyecto: nodos con criterios
  de aceptación, decisiones y *punteros* al código (el mapa, no el territorio).
- **Triage** — toda tarea se clasifica por radio de impacto (FIX/S · M · L)
  antes de escribir código, con límite anti-monstruo que frena diffs desbocados.
- **Slices verticales** — incrementes flacos de punta a punta; el slice 1 es
  siempre un esqueleto caminante que valida la arquitectura.
- **Verificación real** — terminado significa: criterios cumplidos, tests
  corridos, la cosa ejecutada de verdad, y un verifier independiente de solo
  lectura que intentó *refutarla*.

Núcleo agnóstico (`/core`), adaptadores por herramienta. Hoy solo existe el
adaptador de OpenCode; el núcleo nunca depende de él.

## Quickstart (5 minutos)

**Requisitos:** [git](https://git-scm.com), [Node.js](https://nodejs.org)
(18+) y una herramienta con soporte de skills (OpenCode 2.x para el adaptador
incluido).

```bash
# 1. Cloná el kit donde quieras (es global, no por proyecto)
git clone https://github.com/fedesauzzadev/brainloom.git
cd brainloom

# 2. Instalá en tu config global de OpenCode (nunca pisa archivos ajenos)
node adapters/opencode/install.mjs
```

**3. Onboardeá un proyecto** — abrí tu proyecto en OpenCode y ejecutá:

```
/init-brain
```

Descubre tus comandos test/lint/build/run, pregunta lo que no pueda inferir
(idioma, modelos para `strong`/`balanced`/`fast`), genera `brain/` más una
sección corta en `AGENTS.md`, y se valida solo. ¿Codebase existente? Ofrece
`adopt` para mapearlo por áreas.

**4. Trabajá normal.** Toda tarea pasa por triage — en lenguaje natural o con
los comandos (`/triage`, `/plan-project`, `/build-slice`, `/fix`, `/verify`,
`/reconcile`, `/adopt`, `/init-brain`, `/kit-update` — tabla arriba).

## Uso diario, tres formas

**Proyecto nuevo** — describí la idea entera: *"haceme un CLI de notas con
tags"*. Triage deriva a `plan-project`: recibís una propuesta de slices (el 1
es un esqueleto caminante), la aprobás, y después `/build-slice` — cada nodo
con criterios de aceptación *antes* del código, flaco, y verificado
ejecutándolo de verdad más un verifier independiente.

**Tarea mediana** — *"agregar filtrado por tag a la lista"*. Triage dice M; se
convierte en nodo del slice actual con criterios primero; build-slice engorda
el esqueleto; el verifier intenta refutarla antes de que algo quede `done`.

**Un fix** — *"el listado muestra las notas al revés"*. `/fix` lo clasifica
FIX/S, escribe criterios observables, corrige encapsulado (sin refactors de
paso), verifica de verdad y actualiza el brain. Si el "fix" toca contratos
compartidos, el flujo frena y reclasifica — para eso existe.

## Actualizaciones

El kit es versionado (SemVer). Al iniciar sesión, un plugin chico chequea el
remoto (solo git fetch, caché de 24 h, tolerante a offline, sin telemetría) y
si hay versión nueva recibís **una línea**. `/kit-update` muestra el changelog
resaltando `[BREAKING]`, pide confirmación, actualiza, reinstala y corre las
migraciones de brains — dry-run primero, backup antes de cada paso, validación
después, rollback automático si algo falla. Un brain nunca queda inutilizable
tras una actualización.

Opt-out por proyecto: `update_check.enabled: false` en `brain/config.yaml`.

## Licencia

[MIT](LICENSE) — contribuciones bienvenidas, ver [CONTRIBUTING](CONTRIBUTING.md).
