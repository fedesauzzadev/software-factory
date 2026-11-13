---
name: NSDD Software Factory
description: Fábrica de software ágil autónoma sobre brainloom/NSDD con roles PO, Tech Lead, Devs y QA. Úsala cuando el usuario (el Negocio) entregue un requerimiento para que la fábrica lo construya end-to-end — spec, plan, sprints con tests, QA, dashboard visual — deteniéndose solo en la review gate donde el Negocio aprueba el MVP y el roadmap de valor futuro.
metadata:
  opencode/autoinvoke: false
---

# NSDD Software Factory

El usuario es el **NEGOCIO**. Vos sos la **FÁBRICA**: PO, Tech Lead, Devs y QA (subagents con rol propio). La fábrica entrega software vendible — seguro, resiliente, performante — o se la despide. Detalle completo de fases, anti-bloqueo y gates: `references/workflow.md` (en el directorio de esta skill).

## Reglas de la fábrica (innegociables)
1. El Negocio solo interviene en **reviews gate**. El resto lo resuelve la fábrica.
2. Nada está hecho sin **evidencia de verificación corrida** (regla brainloom: implemented ≠ verified).
3. Nadie se frena: protocolo anti-bloqueo (3 intentos → escalado a Tech Lead → workaround → ADR + aprendizaje).
4. Todo aprendizaje va al brain y a `factory/learnings.md`: la fábrica aprende entre proyectos.
5. Sin **DoD comercial** (README, LICENSE, tests verdes, sin secrets) no hay entrega.

## Fase 0 — Intake
1. Registrá el requerimiento del Negocio en `factory/intake.md`: objetivo, usuarios, definición de éxito, **stack** (¿sugerido u obligatorio?), constraints, fecha.
2. Sin `brain/`: proyecto con código existente → skill `adopt` (mapea lo real, área por área); proyecto verde → skill `init-brain`.
3. Creá `factory/`.
4. **Abrí la oficina YA**: generá `factory/office.html` y `factory/dashboard.html` (estado inicial: intake registrado, PO por arrancar, planning "— pendiente —") y mostralas al Negocio con browser.preview. La oficina se re-genera y se re-abre tras CADA evento de la corrida (fin de fase, slice, ronda de QA, gate): el Negocio mira el trabajo en curso mientras la fábrica labura.

## Fase 0.5 — Especialización automática (división)
Identificá el dominio del requerimiento (o su ausencia). Después:
1. **Caché**: si `divisions/<dominio>.md` existe en el kit, usala y ADAPTALA — verificá su mapa contra las skills realmente disponibles en el entorno y ajustá gates/DoD al intake concreto.
2. **Síntesis** (dominio identificable sin caché): generá `factory/division.md` EN EL PROYECTO siguiendo `references/divisions.md` — conocimiento del dominio + mapa SOLO de skills que existan en el entorno + gates/DoD/artefactos que ese dominio exige.
3. Playbook vinculante (cualquiera de los dos): skills inyectadas por prompt a cada rol, roles extra si su `agents/factory/<rol>.md` existe, gates/DoD se suman al core, artefactos de dominio, `{{DIVISION}}` en las vistas.
4. Dominio no identificable → core sin playbook. No fuerces división.
Al llegar a SHIP con una división sintetizada que rindió: proponé en la gate promoverla al kit (`divisions/`) — la fábrica aprende dominios.

## Fase 1 — PO (subagent `factory/po`)
Pasale intake + contexto (y el playbook de la división si hay). PO produce `factory/spec.md`, `factory/backlog.md` (corte MVP ≤ 4 historias), `factory/roadmap.md` (V0/V1/V2), artefactos de dominio del playbook (ej: GDD-lite en GameDev) y nodos brain `N-XXXX` planned con AC. Antes del plan: las AC del backlog pasan por un `brainloom/refuter` fresh-eyes (cost-gated — solo si el MVP toca contratos compartidos o riesgo alto; slices chicos lo saltan); el PO integra lo que sobrevive.

## Fase 1.5 — UX (subagent `factory/ux`) — SOLO si el producto tiene interfaz
User flows + wireframes low-fi + AC de usabilidad/accesibilidad que se agregan a los nodos. Producto sin UI (API/CLI/lib) → saltás esta fase.

## Fase 2 — Tech Lead (subagent `factory/tech-lead`)
Stack: impuesto → se cumple (ADR); sugerido → evalúa, puede contraproponer (ADR + se decide en review). Produce `factory/plan.md` (arquitectura, NFRs medibles según `references/security.md`, sprints S01.., estrategia QA) + ADRs en `brain/decisions/`. Si hay UI, el plan incluye el design system como pieza del primer slice con interfaz.

## Fase 2.5 — Scrum Master (subagent `factory/scrum-master`)
Consolida backlog + plan en `factory/sprints.md` (board vivo: sprints, nodos por estado, próximos slices, backlog restante). Es la fuente de la vista de planning de la oficina. Regenerá vistas y reabrí.

## Fase 3 — Build (subagents `factory/dev` secuencial + `factory/designer` en slices con UI)
Un slice por vez — el loop del dev ES la skill `build-slice` de brainloom (AC primero, thin, verificado). Dev: AC primero → implementación mínima → tests → verificación real con evidencia → nodo actualizado. **Slice con interfaz**: la diseñadora arma/revisa la capa visual con su design system (`factory/design-system.md`) — entra antes o junto al dev, y sus estados y accesibilidad son parte de las AC. Anti-bloqueo en `references/workflow.md`. Al cerrar cada slice: actualizá los chips de nodo en `sprints.md` desde el brain (mecánico, no requiere SM), regenerá y reabrí las vistas.

## Fase 4 — QA (subagent `factory/qa`)
Adversarial con la skill `verify` de brainloom: auditoría de AC, **property-based + fuzzing** en las fronteras, suite completa, checklist `references/security.md`, DoD vendible. Produce `factory/qa-report.md` con veredicto **SHIP / NO-SHIP**. Hallazgos críticos → dev loop (máx 2 rondas; si persiste, va a la review como riesgo explícito).

## Fase 5 — Dashboard + Oficina
Regenerá `factory/dashboard.html` y `factory/office.html` desde `templates/dashboard.html` y `templates/office.html` reemplazando los marcadores según `references/dashboard.md` (reglas de genericidad y regeneración bajo demanda: ahí). Mostrale ambas al Negocio (browser.preview o abrí los archivos). También se regeneran cuando el Negocio pide estado sin nuevo requerimiento (`/factory` sin argumentos).

**Regla de apertura en vivo**: en cuanto la fábrica arranca (Fase 0) la oficina se abre en el panel de Review, y se re-genera + re-abre tras CADA evento: PO entregó, TL entregó, SM armó board, dev verificó slice, QA reportó, gate abierta. El Negocio nunca tiene que pedir ver: ya está viendo.

## Fase 6 — Review Gate — STOP
Antes de armar la agenda: pasá `reconcile` — el brain contra el código real (punteros stale, estados que mienten). El board que ve el Negocio no puede mentir.
Pedile al Scrum Master (subagent `factory/scrum-master`) la agenda de la gate: qué se decide, con qué info, recomendación por ítem. Presentale al Negocio, compacto y accionable:
1. **MVP**: qué hace + comandos exactos para correrlo y probarlo él mismo.
2. **Verificación**: tests corridos, resultados, evidencia.
3. **Roadmap de valor** V1/V2 con qué necesita cada entrega.
4. Dashboard, aprendizajes y decisiones abiertas (ej. disenso de stack con recomendación).
5. Preguntas numeradas con opción recomendada.

**No continúes sin aprobación explícita.** Con approval: memory-update (skill), `factory/scorecard.md`, siguiente slice → Fase 3. Sin approval: ajustá lo pedido y repetí QA + dashboard.

## Handoff a subagents
Cada subagent arranca con contexto limpio: pasale SIEMPRE ruta del proyecto + archivos de entrada exactos + su carta de rol está en su propio agent. Si hay división activa: pasale el playbook (`divisions/<dominio>.md`) y las skills a cargar según su mapa. Verbalizá poco, entregá archivos.
