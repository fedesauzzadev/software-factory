# Workflow — detalle de fases

## Gates (únicos puntos de pausa)

| Gate | Quién aprueba | Qué se aprueba |
|---|---|---|
| G1 — fin de plan | Fábrica (auto) | Tech Lead confirma plan ejecutable; no molesta al Negocio |
| G2 — review de MVP | **Negocio** | MVP + roadmap futuro + decisiones abiertas |
| G3 — review por entrega V1+ | **Negocio** | Incremento de valor + roadmap actualizado |

Todo lo demás corre sin intervención del Negocio.

## Protocolo anti-bloqueo (la fábrica no se frena)

1. Dev: 3 intentos con enfoques DISTINTOS (reintentar lo mismo no cuenta como intento).
2. Persiste → dev registra en `factory/learnings.md`: error exacto, intentos, contexto → escala a `factory/tech-lead`.
3. Tech Lead decide: workaround técnico / alternativa de librería / degradación de scope que preserve AC (si toca valor, consulta al PO).
4. Resolución → ADR en `brain/decisions/` + lección en `factory/learnings.md` (causa raíz + qué hacer distinto la próxima).
5. Si el Tech Lead tampoco resuelve: el slice se degrada a lo verificable, el gap queda en el roadmap como deuda EXPLÍCITA y entra a la review como riesgo. Nunca se esconde.

## Learnings (la fábrica aprende)

`factory/learnings.md` — una entrada por bloqueo o descubrimiento:
```
## L-XX — <título>
- Qué pasó: <error/situación exacta>
- Intentos: <los 3>
- Resolución: <qué funcionó / decisión>
- Lección: <qué hacer distinto la próxima vez, accionable>
```
Al cerrar un proyecto: retro breve. Aprendizajes genéricos (no específicos del proyecto) → proponer al Negocio actualizar este kit para que toda la fábrica mejore.

## Scorecard (por review)

`factory/scorecard.md`:
- Historias entregadas / planificadas, AC cumplidas / totales.
- Tests: cantidad, verdes/rojas, p95 medido vs objetivo.
- Hallazgos QA por severidad, rounds de rework.
- Bloqueos: cuántos, cuántos resueltos por escalado, tiempo perdido estimado.
- Veredicto SHIP/NO-SHIP y riesgo residual.

## Ejecución de subagents
- Secuencial por defecto (`brain/config.yaml → max_parallel_agents`).
- Cada rol recibe: ruta absoluta del proyecto, archivos de entrada, y su salida esperada (su agent ya tiene la carta de rol).
- Foreground para PO/TL/SM/QA; dev slice a slice. Background solo si el Negocio pide seguir viendo otra cosa.
- El orquestador NO reescribe lo que producen los roles: los consume y encadena.
- **SM corre dos veces como mínimo**: al inicio (board `sprints.md` tras PO+TL) y antes de cada gate (agenda). Entre slices el orquestador refresca chips de estado mecánicamente desde el brain.
- **Ritmo visual**: cada entrega de rol y cada cierre de slice → regenerar oficina+dashboard y reabrir en el Review.

## Iteración entre sprints
1. Approval del Negocio → siguiente slice del plan (Fase 3) o siguiente entrega del roadmap.
2. Antes de cada slice: `triage` (FIX/S, M, L) del delta — respeta las clases brainloom.
3. Después de cada slice: `memory-update` + dashboard + (si toca valor) mini-review con el Negocio.
