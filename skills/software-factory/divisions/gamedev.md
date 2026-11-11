# División GameDev — software factory de videojuegos

## Detección
- Señales en el intake: "juego/game", nombre de engine (Godot, Unity, Unreal, Phaser, Bevy, Defold, LÖVE, pygame, Roblox), "gameplay", "nivel/personaje/sprite/tilemap", "VFX/partículas", "boss/enemigo/IA", "jam" (cuidado: jam = restricción de tiempo extra, preguntar).
- Artefactos esperados: proyecto de engine, builds jugables, GDD.

## Ajustes de equipo
- **+ 🎨 Game Artist** (`agents/factory/artist.md`): VFX, personajes, ambientes, sprites/tilesets. Entra en Fase 3 en todo slice con contenido visual de juego.
- PO con lente de diseño: su spec/backlog se apoya en un GDD-lite (artefacto de dominio).
- UX aplica SIEMPRE (un juego es UI + flujos: menús, HUD, pausa).
- SM vigila scope-creep de features de juego ("¿es core loop o es decoración?").

## Mapa de skills (por rol) — el orquestador inyecta "Cargá las skills: ..." en cada prompt
| Rol | Skills a cargar | Cuándo |
|---|---|---|
| Orquestador | `router` | Fase 0.5: detectar engine y skills exactas del proyecto |
| PO | — (dominio en el GDD-lite) | siempre |
| UX | `game-ui-ux` (+ `input-systems` si hay rebinding) | Fase 1.5 |
| Tech Lead | `router` + skills del engine detectado (ej. `godot-*`, `unity-*`, `unreal-*`) | Fase 2 |
| Dev | skills del engine del proyecto + según tarea: `godot-2d-movement`/`platformer`, `game-ai`, `camera-systems`, `save-systems`, `godot-multiplayer`, `audio-design`, `physics-tuning` | Fase 3, por slice |
| Game Artist | `create-game-assets`, `shader-programming`/`godot-shaders`, `game-feel` | Fase 3 |
| Dev (polish) | `game-feel` (juice: shake, hit-stop, squash & stretch) | último slice antes de QA |
| QA | `godot-gdscript-headless-testing` (si Godot) + `performance-optimization` | Fase 4 |
| Envío | `godot-export` / `unity-build-pipeline` / `unreal-packaging`; `itch-publish`/`steam-publish` si el Negocio lo pide | post-gate |

## Gates de dominio (QA — se suman a security.md)
1. **El juego CORRE**: build/proyecto ejecutado de verdad desde instalación limpia (no "compila").
2. **Playtest por AC**: cada mecánica del backlog jugada y observada; core loop completable de punta a punta.
3. **Game feel**: cada acción del jugador tiene feedback audible + visible dentro de ~100 ms; muerte/daño/colisión con impacto (shake/hit-stop/partículas). Hallazgo Mayor si una acción central se siente muerta.
4. **Performance**: frame budget medido (objetivo 16,6 ms @60 FPS para el target del plan); sin spikes > 33 ms en el camino crítico.
5. **Resiliencia**: guardar/cargar corrupto no tumba el juego; input inválido no bloquea el loop.
6. **Export**: un build exportable del platform target existe y abre.

## DoD de dominio
- README con: qué se juega, controles, cómo correr el proyecto Y el build, requisitos del engine (versión exacta).
- Pantalla de título + pausa + game over/restart mínimos navegables.
- Config mínima: volumen y salir del juego.
- Sin assets con licencia incompatible; créditos de assets de terceros.

## Artefactos de dominio
- `factory/gdd-lite.md` (PO, Fase 1): core loop, mecánicas, progresión, referencia de feel, alcance V0/V1/V2 en lenguaje de juego.
- `factory/art-bible-lite.md` (Game Artist, primer slice visual): estilo, paleta, silueta de personajes, resolución/pixel ratio, lista de assets V0.
