# División CRM/Businesstech — gestión, ventas y marketing

## Detección
- Señales en el intake: "CRM", "gestión de clientes/contactos/leads", "pipeline/embudo/funnel", "ventas", "marketing/campañas", "seguimiento comercial", "reportes de ventas", "facturación interna", "Kanban de oportunidades", "agenda comercial", "integración email/calendario".
- Artefactos esperados: modelo de datos comercial, importadores CSV, dashboards de indicadores.

## Ajustes de equipo
- Sin roles extra: el núcleo basta. Énfasis nuevos:
  - **PO con lente comercial**: el valor se expresa en términos del vendedor/marketero (tiempo ahorrado por operario, conversión, cero duplicados), no en features.
  - **Tech Lead con rigor de datos**: el modelo de entidades es la decisión más cara — la revisa doble (ADR dedicado).
  - **QA con sombrero de auditor**: permisos y pérdida de datos son hallazgos Críticos.

## Mapa de skills (por rol)
| Rol | Skills a cargar | Cuándo |
|---|---|---|
| Todos | — (dominio inline en este playbook, no hay skills de CRM instaladas) | siempre |

## Modelo de referencia (el TL parte de acá y adapta — ADR si cambia)
- Entidades núcleo: Contact, Account/Company, Deal/Oportunidad (con pipeline stages explícitas: ej. nuevo → calificado → propuesta → ganado/perdido), Activity (llamada/email/reunión/tarea), User/Role.
- Reglas de oro: un Deal SIEMPRE pertenece a un owner; cambios de stage quedan en audit log con timestamp y actor; montos con moneda explícita; borrado lógico (soft delete) por defecto.

## Gates de dominio (QA — se suman a security.md)
1. **RBAC real**: usuario común no ve datos de otros (salvo rol admin/manager) — probado con dos usuarios semilla, no por código solamente.
2. **Integridad comercial**: suma de deals por stage = total del pipeline; monto negativo/cero rechazado o justificado; stage inválido imposible.
3. **Import/export round-trip**: CSV de contactos/deals entra y sale sin pérdida ni corrupción (RFC 4180, comillas, comas, acentos, BOM).
4. **Audit log**: cambio de stage y edición de monto dejan traza (quién, cuándo, antes/después) que no se puede editar desde la app.
5. **Performance sobre volumen**: listados y dashboard del pipeline con dataset seed (≥10k contactos, ≥1k deals) bajo el p95 del plan.
6. **Sin fuga cruzada**: búsqueda global no expone datos fuera del permiso del usuario.

## DoD de dominio
- Seed data realista incluido (roles admin/vendedor, pipeline poblado) — demo vendible en minutos.
- Onboarding de un admin nuevo ≤ 10 min documentado (crear usuario, importar CSV, primer deal).
- Export completo de TODOS los datos del cliente (portabilidad, formato documentado).
- Glosario comercial en el README: qué es un lead, stage, deal ganado — en el lenguaje del cliente.

## Artefactos de dominio
- `factory/domain-model.md` (TL, Fase 2): ERD de entidades, estados y transiciones del pipeline (con guardas), permisos por rol, invariantes de integridad. El PO lo valida contra el glosario comercial antes de Fase 3.
