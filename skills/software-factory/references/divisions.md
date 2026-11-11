# Divisiones — especialización por dominio

Una **división** es una especialización de la fábrica: mismo workflow core (Fases 0-6), equipo y estándares ajustados al dominio del requerimiento. Las divisiones viven en `divisions/<dominio>.md` (junto a esta skill).

## Detección (Fase 0.5)
Tras el intake, clasificá el dominio leyendo la sección **Detección** de cada playbook:
- Match claro → esa división rige la corrida. Empate entre dos → preguntale al Negocio en la review gate, entretanto usá la de señales más fuertes.
- Sin match → fábrica genérica (core tal cual). **No fuerces división** a un requerimiento que no la pide.

## Cómo aplica el playbook (vinculante)
1. **Mapa de skills**: por cada rol que lance un subagent, agregá al prompt la línea `Cargá las skills: <lista del mapa para ese rol>`. Los especialistas son las skills ya instaladas en el entorno — la división las orquesta, no las duplica.
2. **Roles extra**: si el playbook declara un rol y existe `agents/factory/<rol>.md`, entra al flujo donde el playbook diga. La oficina lo muestra como puesto (o "no requerida" si la división no aplica).
3. **Gates y DoD de dominio**: se SUMAN a `references/security.md` y al veredicto SHIP/NO-SHIP de QA.
4. **Artefactos de dominio**: archivos extra que la corrida produce (el PO/TL los genera según el playbook).
5. **Visibilidad**: oficina y dashboard muestran la división activa (`{{DIVISION}}`).

## Formato de un playbook (para escribir divisiones nuevas)
```markdown
# División <nombre>
## Detección
- Señales: keywords/frases del intake, artefactos esperados, entregables nombrados.

## Ajustes de equipo
- Roles extra (agent en agents/factory/), roles core con énfasis nuevo, roles que no aplican.

## Mapa de skills (por rol)
| Rol | Skills a cargar | Cuándo |

## Gates de dominio (QA)
- Verificaciones adicionales obligatorias para SHIP.

## DoD de dominio
- Addenda a la DoD vendible core.

## Artefactos de dominio
- Archivos extra que produce la corrida y quién los genera.
```
Regla de oro: una división suma al core, nunca lo reemplaza — anti-bloqueo, evidencia real y review gates siguen intactos.
