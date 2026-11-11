# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/) · Versionado: [semver](https://semver.org/).

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
