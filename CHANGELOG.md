# Changelog

Formato: [Keep a Changelog](https://keepachangelog.com/) · Versionado: [semver](https://semver.org/).

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
