# Evidencia — smoke test Fase 0.5 (síntesis de división)

- **Fecha**: 2026-11-11
- **Delta verificado**: v0.4.0 — especialización automática (síntesis de división para dominio sin caché).
- **Qué corrió**: síntesis real de playbook para requerimiento fintech sintético (`tests/fixtures/smoke-fintech/factory/intake.md`) siguiendo `references/divisions.md` + `SKILL.md` Fase 0.5, y verificación mecánica con `scripts/check-division.mjs`.

## Esperado vs observado
| Aspecto | Esperado | Observado |
|---|---|---|
| Playbook generado en `factory/division.md` del proyecto | sí | sí |
| 6 secciones del formato | todas | todas ✓ |
| Mapa honesto con skills del entorno | sin skills fintech → conocimiento inline, sin citas falsas | ✓ "ninguna skill del entorno aplica" |
| Gates observables (no aspiracionales) | lenguaje verificable | ✓ (aritmética decimal, idempotencia, CSV hostil, no-log de saldos) |

## Límites del smoke (lo que NO verifica)
- No corrió la inyección de skills en prompts de subagents reales (no hay skills del dominio — nada que inyectar).
- No corrió la corrida completa sobre ese playbook (PO→TL→…→QA). Primera corrida real con dominio sin caché debe registrar evidencia propia y, si rinde, proponerse promoción.

## Veredicto
Fase 0.5 síntesis: **verified (smoke)**. El kit pasa de implemented a verified en su delta 0.4.0 con esta evidencia + fixture + check en CI.
