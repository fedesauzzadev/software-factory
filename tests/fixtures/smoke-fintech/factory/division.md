# División Fintech Personal — SÍNTESIS (smoke)

## Detección
- Señales: extractos bancarios, presupuestos, transacciones, cuentas, finanzas personales, suscripción.

## Ajustes de equipo
- Sin roles extra (núcleo basta).
- PO con lente de usuario financiero: valor = "saber en qué se va la plata", no features contables.
- Tech Lead: la aritmética de dinero es la decisión más cara → ADR dedicado.
- QA con sombrero de auditor financiero: centavo perdido = hallazgo Crítico.

## Mapa de skills (por rol)
| Rol | Skills a cargar | Cuándo |
|---|---|---|
| Todos | — (ninguna skill del entorno aplica a fintech; conocimiento inline en este playbook) | siempre |

## Gates de dominio (QA)
1. **Aritmética exacta**: sumas/restas de dinero en decimal (o enteros en centavos) — JAMÁS float. Round-trip: importar CSV con 1000 tx → total por categoría = suma manual verificada.
2. **Sincronización idempotente**: re-importar el mismo extracto NO duplica transacciones (idempotencia por id de extracto+fecha+monto+descripción hasheada).
3. **Datos sensibles**: el importador nunca loguea saldos ni descripciones completas; export del usuario sin filtrar nada.
4. **CSV hostil**: comillas, comas, acentos, BOM, montos con separador argentino (1.234,56) parseados o rechazados con mensaje — nunca silenciosamente mal.
5. **Presupuesto consistente**: presupuesto ≤ 100% del ingreso definido o warning explícito; categoría sin presupuesto visible.

## DoD de dominio
- Seed con datos realistas (extracto de ejemplo incluido).
- Export completo de datos del usuario (portabilidad) documentado.
- Disclaimer "no es asesoría financiera" en README.
- Glosario: extracto, transacción, categoría, presupuesto — en lenguaje del usuario.

## Artefactos de dominio
- `factory/money-rules.md` (TL, Fase 2): representación de dinero, redondeo, moneda única/multi, idempotencia del importador, invariantes. PO lo valida antes de Fase 3.
