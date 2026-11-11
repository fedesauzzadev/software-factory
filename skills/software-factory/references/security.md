# Checklist de calidad — seguridad, resiliencia, performance, DoD vendible

QA y Tech Lead usan esta lista. Cada ítem se reporta: **OK / FALLA / N/A + evidencia** (comando, output, path).

## Seguridad (trust boundaries primero)
- [ ] Toda entrada externa (HTTP, args, env, archivos) validada: tipo, rango, tamaño, formato. Rechazo explícito con código correcto (400/422), no crash.
- [ ] Cero secrets en código, tests, logs ni commits. Config SOLO por variables de entorno (`.env` fuera de VCS).
- [ ] Dependencias: audit sin vulnerabilidades Críticas/Altas (`npm audit` / `pip audit` / equivalente). Lockfile commiteado.
- [ ] Errores no filtran internals (stack traces, rutas, versiones) hacia afuera.
- [ ] Inyección: sin construir queries/comandos/shell por concatenación.
- [ ] Si hay auth: passwords hasheados (argon2/bcrypt), tokens con expiración, rate limiting en endpoints sensibles.

## Resiliencia
- [ ] Toda IO externa (red, disco, procesos) con timeout explícito.
- [ ] Errores manejados: códigos correctos, mensajes accionables, sin estados corruptos a medias.
- [ ] Retry con backoff solo donde la operación es idempotente o segura.
- [ ] Fallback/degradación definida para dependencias opcionales.
- [ ] Crash-coherencia: input malformado NO tumba el proceso (probarlo: payload basura, campos faltantes, tipos incorrectos).

## Performance
- [ ] p95 del flujo principal MEDIDO (no estimado) vs objetivo del plan.
- [ ] Sin trabajo O(n²) evitable en el camino caliente; sin IO bloqueante en loops.
- [ ] Memoria estable en corrida repetida (sin leaks evidentes en 50+ iteraciones del flujo principal).

## DoD vendible (sin esto no hay SHIP)
- [ ] README: qué es, para quién, instalar y PROBAR en ≤5 minutos, comandos exactos.
- [ ] LICENSE definida.
- [ ] Versión (semver) + CHANGELOG.
- [ ] Suite de tests verde, corrida desde instalación limpia.
- [ ] Cero TODO/FIXME críticos en código entregado.
- [ ] El producto hace lo que el spec dice que hace — cada AC del MVP marcada con evidencia.
- [ ] Si hay UI: accesibilidad básica — contraste AA, focus visible, labels en inputs, navegable por teclado; consistencia con el design system (`factory/design-system.md`).

## Umbrales por defecto (Tech Lead puede ajustar por producto)
| Tipo | p95 objetivo |
|---|---|
| API local / CLI | < 200 ms |
| Render/generación de documentos | < 2 s |
| Job batch | progresión lineal, sin degradación por corrida |
