# Dashboard visual — factory/dashboard.html + factory/office.html

Dos archivos, cero dependencias externas, se abren en cualquier navegador. Se REGENERAN completos (no se editan a mano) después de cada fase/slice/review: el orquestador lee los templates `templates/dashboard.html` y `templates/office.html`, reemplaza los marcadores y escribe en `factory/` del proyecto.

## Marcadores (HTML simple, sin scripts dentro de los fragmentos)

| Marcador | Contenido | Fuente de datos |
|---|---|---|
| `{{PROJECT_NAME}}` | Nombre del producto | factory/spec.md |
| `{{GENERATED_AT}}` | Fecha/hora de regeneración | now |
| `{{MVP_INFO}}` | 3-6 bullets: qué hace el MVP + estado + cómo probarlo | spec + qa-report |
| `{{KANBAN_CARDS}}` | Una card por historia: ID, título, chips de estado (backlog/in-progress/implemented/verified), AC como checklist | backlog + brain/nodes |
| `{{ROADMAP_ITEMS}}` | Timeline V0/V1/V2: valor, items, estado (entregado/en-plan/futuro) | roadmap.md |
| `{{QUALITY_SUMMARY}}` | Tests (nº verdes/rojas), p95 medido, hallazgos QA por severidad, veredicto SHIP/NO-SHIP | qa-report.md |
| `{{LEARNINGS}}` | Lista L-XX: título + lección accionable | factory/learnings.md |
| `{{DECISIONS}}` | ADRs: D-XXXX título + decisión en una línea | brain/decisions/ |

## Reglas
- Estado de chips usa clases CSS del template: `.st-planned`, `.st-inprogress`, `.st-implemented`, `.st-verified`, `.st-ship`, `.st-noship`.
- Si una sección no tiene datos aún (ej. QA antes de Fase 4), se deja "— pendiente —".
- Fragmentos generados por el orquestador: HTML plano válido, escapando todo contenido dinámico (`<` `>` `&`).
- Nunca incluir secrets ni rutas absolutas del entorno en el dashboard.

# Oficina visual — factory/office.html

Vista de piso de fábrica: un puesto por agente, qué hace ahora y el historial de actividad. Generada junto al dashboard (mismas reglas de escape).

| Marcador | Contenido | Fuente de datos |
|---|---|---|
| `{{PROJECT_NAME}}` | Nombre del producto | factory/spec.md |
| `{{GENERATED_AT}}` | Fecha/hora de regeneración | now |
| `{{DIVISION}}` | División activa (ej: "División GameDev · engine: Godot") o "Fábrica genérica" | divisions/ + Fase 0.5 |
| `{{FACTORY_STATE}}` | Fase actual + gate (ej: "Fase 4 — QA adversarial · próximo: review gate con el Negocio") | workflow |
| `{{SPRINT_STRIP}}` | Chips de sprints en línea: `S01 ✅ · S02 🔨 en curso · S03 🗓️` (clases `.ok` verificado, `.on` en curso, neutro planificado) | factory/sprints.md |
| `{{BOARD}}` | Kanban visual: 5 columnas `.bcol` (Backlog · Planificado · En curso · Verificado · Entregado) con notas `.note` (clase por estado: `.n-plan`, `.n-busy`, `.n-impl`, `.n-ver`, `.n-ship`): `<span class="nid">N-XXXX · H-XX</span> título <small>slice/nota</small>`. Una nota por nodo/historia, en la columna de su estado real del brain. Sin datos: columna vacía con "—" | factory/sprints.md + brain/nodes |
| `{{AGENTS}}` | Una card `.desk` por rol: avatar, nombre, rol, chip de estado (`.st-busy` trabajando / `.st-done` entregó / `.st-waiting` espera al Negocio / `.st-idle` libre), burbuja con su tarea actual o último entregable | estado de sesión |
| `{{FEED}}` | Líneas `<time> · <who> · qué pasó` en orden cronológico, una por evento de fase (arrancó PO, entregó TL, dev verificó slice, QA halló X, gate abierta…) | historia de la corrida |

El Negocio también tiene puesto: cuando hay gate abierta su desk queda `.waiting` con "esperando tu decisión". Los desks `.busy` llevan clase `pulse` (animación de trabajo).

# Genericidad y regeneración bajo demanda

Ambas vistas son del KIT, no de un proyecto: el mismo template sirve para cualquier producto, stack o dominio. Reglas:

1. **Cero contenido hardcodeado**: nada de nombres, historias, tecnologías o datos de un proyecto específico dentro de los templates. Todo entra por marcadores.
2. **Estado derivado, nunca inventado**: los fragmentos se construyen leyendo ÚNICAMENTE artefactos reales — `factory/*.md`, `brain/index.md`, `brain/nodes/`, `brain/decisions/`, `brain/evidence/` — y la historia de la sesión actual. Si un archivo no existe, su sección queda "— pendiente —". Prohibido rellenar con supuestos.
3. **Regeneración completa en cada disparador**: fin de fase, fin de slice, ronda de QA, gate abierta, y **bajo demanda** — si el Negocio pregunta "cómo vamos" o corre `/factory` sin argumentos, se regeneran ambas vistas con el estado del momento y se muestran (browser.preview si está disponible, o la ruta del archivo). En corrida activa, la oficina se abre en el Review desde la Fase 0 y se re-abre en cada evento.
4. **Autocontenidas**: un solo archivo HTML cada una, sin JS externo, sin servidor, sin build. Abren en cualquier navegador y en el panel de Review.
5. **Iteraciones**: en corridas futuras del mismo proyecto las vistas se sobreescriben — el historial largo vive en `brain/` y `factory/learnings.md`, no en la vista.
6. **Seguridad**: escapar todo contenido dinámico; jamás incluir secrets, rutas absolutas del entorno ni contenido de `.env`.
