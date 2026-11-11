# Divisiones — especialización automática por dominio

Una **división** es la especialización de la fábrica PARA ESTE requerimiento: mismo workflow core (Fases 0-6), equipo y estándares ajustados al dominio. Se obtiene en forma **automática**, de dos fuentes en orden:

1. **Caché**: `divisions/<dominio>.md` del kit — playbooks ya probados (vienen de ejemplo: `gamedev`, `crm`). Si hay match: **usala y adaptala** — verificá su mapa de skills contra las skills realmente disponibles en el entorno y ajustá gates/DoD al intake concreto. La caché es acelerador, no límite.
2. **Síntesis**: sin caché y dominio identificable → el orquestador **genera** `factory/division.md` EN EL PROYECTO con el formato de abajo, anclada en tres fuentes:
   - conocimiento del dominio (cómo se construye y se vende este tipo de producto),
   - **inventario real de skills del entorno** — mapeá SOLO skills que existan; si ninguna aplica, el conocimiento va inline en el playbook,
   - los gates/DoD que ese dominio exige para que el producto sea vendible.

Sin dominio identificable (infra genérica, script, lib técnica) → fábrica core sin playbook. En duda → división liviana (gates mínimos de dominio). Nunca inventes un dominio que el intake no nombra.

## Cómo aplica el playbook (vinculante — caché o síntesis)
1. **Mapa de skills**: por cada rol que lance un subagent, agregá al prompt `Cargá las skills: <lista del mapa para ese rol>`.
2. **Roles extra**: si el playbook declara un rol y existe `agents/factory/<rol>.md`, entra al flujo donde el playbook diga; la oficina lo muestra como puesto.
3. **Gates y DoD de dominio**: se SUMAN a `references/security.md` y al veredicto SHIP/NO-SHIP de QA.
4. **Artefactos de dominio**: archivos extra que la corrida produce (PO/TL los genera según el playbook).
5. **Visibilidad**: `{{DIVISION}}` en oficina/dashboard (ej: "División: Fintech · síntesis" o "División GameDev · caché").

## Formato del playbook (para caché y síntesis)
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

## Promoción (la fábrica aprende dominios)
La síntesis vive en `factory/division.md` del proyecto. Si la corrida llegÓ a SHIP y la división aportÓ, el SM la incluye en la agenda de la gate: "¿promovemos esta división al kit?" Con approval del Negocio → se guarda como `divisions/<dominio>.md` (en tu clone del kit o directamente en la skill instalada) y la próxima corrida de ese dominio arranca con caché. Así el kit crece con dominios reales que tu fábrica ya resolvió — no con listas predefinidas.
