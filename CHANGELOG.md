# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/) · Versionado: [semver](https://semver.org/).

## [0.5.0] — 2026-11-12

### Changed
- **Upgrade sedoso de brainloom**: los instaladores comparan la versión instalada (`brainloom.kit.json`) con la vendida — más vieja → actualizan solos con `--force` (el installer poda los archivos que la nueva versión ya no incluye); más nueva → no tocan nada; igual → idempotente. Un archivo del kit editado localmente sigue reportándose como colisión: nunca se pisa en silencio.
- **brainloom vendido 0.3.0 → 0.8.0** (`vendor/brainloom/`, MIT): incluye las 6 skills nuevas (`adopt`, `build-slice`, `plan-project`, `reconcile`, `small-change`, `verify` — esta última con testing adversarial property-based + fuzzing), los 4 agents `brainloom/*` (planner, refuter, scout, verifier), los 8 comandos (`/adopt`, `/build-slice`, `/fix`, `/init-brain`, `/plan-project`, `/reconcile`, `/triage`, `/verify`), `scripts/smoke.mjs`, fixtures nuevos y el AGENTS template con model routing. Se excluye `brain/` del kit upstream (memoria propia de ese repo, no distribuible). Instaladores sin cambios: `install.mjs --config-dir` sigue siendo la interfaz.
- `validate-kit.mjs` y `verify-install.mjs` ahora cubren el layout 0.8.0 (skills/agents/comandos nuevos), no solo el de 0.3.0.

### Added
- **La fábrica usa las capacidades nuevas de brainloom** (antes solo las vendía): Fase 0 con `adopt` para proyectos con código existente; AC del PO atacadas por `brainloom/refuter` fresh-eyes (cost-gated) antes del plan; Fase 3 = loop `build-slice`; QA con skill `verify` (property-based + fuzzing + `brainloom/verifier` que intenta refutar); `reconcile` antes de cada review gate; Fast-Path para deltas refinados y `small-change` para FIX/S en la iteración; `verification.level` (full/smoke) en dev y QA.
- **Guard anti-huérfanos** en `validate-kit.mjs`: si un update del vendor quita una skill que la fábrica referencia, la validación falla y obliga a adaptar o migrar — nada queda huérfano en silencio.

## [0.4.0] — 2026-11-11

### Changed
- **Divisiones automáticas**: la especialización ya no depende de playbooks predefinidos. Fase 0.5 = caché (si `divisions/<dominio>.md` existe, se usa y se adapta al entorno/intake) **o síntesis**: el orquestador genera `factory/division.md` en el proyecto para cualquier dominio, anclado al inventario real de skills del entorno y a gates/DoD del dominio. `gamedev` y `crm` quedan como caché/ejemplo, ninguno obligatorio (la CI valida formato de los presentes, no presencia).
- **Promoción**: una división sintetizada que llega a SHIP se propone en la review gate para entrar al kit — la fábrica aprende dominios reales.

## [0.3.0] — 2026-11-10

### Added
- **Divisiones**: la fábrica se especializa por dominio en Fase 0.5. Playbook vinculante (`divisions/<dominio>.md`): ajusta equipo, mapa de skills a cargar por rol, gates y DoD de dominio, artefactos extra. Sin match → fábrica genérica.
- División **GameDev**: equipo + 🎨 Game Artist (`agents/factory/artist.md`), mapa a las skills de juego instaladas (router, engine packs, game-feel, level-design, VFX/shaders, audio, export/publish), gates de playtest/feel/frame-budget/export, GDD-lite y art-bible-lite.
- División **CRM/Businesstech**: lente comercial del PO, modelo de entidades de referencia, gates de RBAC real/round-trip CSV/audit log/rendimiento con 10k contactos, domain-model.md del TL.
- `references/divisions.md`: formato para escribir divisiones nuevas (el kit crece por dominios).
- Oficina: chip de división activa (`{{DIVISION}}`).

## [0.2.0] — 2026-11-10

### Added
- **brainloom vendido dentro del kit** (`vendor/brainloom/` 0.3.0, MIT): instalar software-factory ahora instala también brainloom (memoria: init-brain, triage, memory-update, kit-update, plugin). Ya no es requisito previo.
- Instaladores ejecutan el installer oficial de brainloom (`install.mjs --config-dir`) con detección de node y manejo de colisiones (nunca sobreescribe una versión distinta sin `--force`).
- `validate-kit.mjs` valida la presencia del vendor; `verify-install.mjs` verifica el layout brainloom instalado (y lo excluye del check de desinstalación — es infra compartida).

## [0.1.0] — 2026-11-10

### Added
- Skill orquestadora `software-factory`: intake → PO → UX (si hay UI) → Tech Lead → Scrum Master → Build (dev + diseñadora) → QA → dashboard/oficina → review gate.
- Agents de rol: `factory/po`, `factory/ux`, `factory/tech-lead`, `factory/scrum-master`, `factory/designer`, `factory/dev`, `factory/qa`.
- Comando `/factory <requerimiento>` (modo estado sin argumentos).
- Vistas visuales genéricas por proyecto: `factory/dashboard.html` (MVP, kanban, roadmap, calidad, aprendizajes, decisiones) y `factory/office.html` (oficina con board de planning kanban, puestos con estado, feed de actividad).
- Protocolo anti-bloqueo (3 intentos → escalado TL → ADR + aprendizaje).
- Integración brainloom como memoria (brain/, triage, memory-update, evidencia).
- Instaladores portátiles con bootstrap: `install.ps1` / `install.sh` (+ uninstall).
- CI GitHub Actions: validación de integridad del kit + install/verify/uninstall en Ubuntu y Windows.
