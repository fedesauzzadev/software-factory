---
description: NSDD Software Factory — le pasa un requerimiento a la fábrica (PO, Tech Lead, Devs, QA) que lo construye end-to-end hasta la review gate. Sin argumentos, muestra el estado visual del proyecto actual.
---

Cargá la skill `software-factory` con la herramienta `skill` y ejecutá su workflow completo desde Fase 0.

Requerimiento del Negocio (texto literal, sin interpretar de más): $ARGUMENTS

Reglas de entrada:
- Si el requerimiento llega vacío: si el proyecto actual tiene `factory/` → modo estado: regenerá `factory/dashboard.html` y `factory/office.html` según `references/dashboard.md` de la skill y reportá fase actual, nodos por estado, hallazgos QA abiertos y gates pendientes. Si no tiene `factory/` → pedí el requerimiento al Negocio una sola vez, en una línea.
- El proyecto destino es el directorio de trabajo actual, salvo que el requerimiento nombre explícitamente otro (en ese caso confirmá la carpeta antes de crearla).
- Si el proyecto ya tiene `factory/` y `brain/` de una corrida anterior → es una iteración: aplicá triage del delta y seguí el workflow desde la fase que corresponda, sin rehacer lo entregado.
