## Why

El backend de Smilbot ha introducido análisis de telemetría para evaluar la suerte histórica de los usuarios en tiradas de gacha (`luck`), ofreciendo endpoints para consultar el ranking global neutralizado contra compras de mercado (`GET /leaderboard/luck`) y enriqueciendo el perfil del usuario con métricas de suerte (`GET /user/:discordId/stats`). Actualmente el bot de Discord no expone estas estadísticas ni cuenta con un comando para visualizar el Top de usuarios con más suerte (o más desafortunados), desaprovechando una funcionalidad competitiva y social clave para la comunidad.

## What Changes

- **Nuevo comando de ranking (`.top` con alias `.topluck`, `.lucktop`):**
  - Subcomando `.top luck` o `.top luck best` (default con `.topluck`): muestra el Top 5 de usuarios con mayor suerte (`order=desc`).
  - Subcomando `.top luck worst` (o `.top luck bad` / `.salados`): muestra el Top 5 de usuarios más desafortunados (`order=asc`).
  - Aplica filtro estándar de 20 tiradas mínimas (`minPulls=20`) y límite fijado en 5 usuarios (`limit=5`).
  - Mensajes amigables cuando ningún usuario califica o faltan tiradas.
- **Actualización del comando `.stats`:**
  - Añade un bloque `🎲 Gacha Luck` mostrando la clasificación (Godly Luck, Lucky, Average, Unlucky, Cursed), el porcentaje delta (`+38.5%`) y el desglose de cartas por rarezas mediante emojis compactos (`18⚪ 11🟢 4🟣 2🟡 0🔴`).
  - Muestra un aviso limpio si el usuario todavía no alcanza las 20 tiradas requeridas para calcular su suerte.
- **Servicios y Modelos de API:**
  - Extensión de interfaces de usuario en `src/services/userService.ts` para incluir `UserLuckStats`.
  - Creación del método para consultar el leaderboard de suerte en `src/services/leaderboardService.ts` o `userService.ts`.
- **Actualización de Documentación (`docs/`):**
  - Actualización de `docs/commands/economy.md` documentando `.top` / `.topluck` y los nuevos datos de `.stats`.
  - Actualización de `docs/integrations/backend-api.md` reflejando el endpoint `GET /leaderboard/luck` y el campo `luck` en `GET /user/:id/stats`.
  - Actualización de `docs/features/cards.md` explicando el cálculo de suerte en gacha y neutralización de mercado.

## Capabilities

### New Capabilities
- `luck-leaderboard`: Visualización en Discord del Top 5 de usuarios con mejor o peor suerte en tiradas gacha a través de `.top luck` / `.topluck`.
- `user-luck-stats`: Exposición del perfil de suerte y desglose de rarezas de un usuario en el comando `.stats`.

### Modified Capabilities
<!-- Ninguna especificación previa modificada ya que openspec/specs está limpio -->

## Impact

- **Código afectado:**
  - `src/services/userService.ts` (tipos de datos enriquecidos con `luck`).
  - `src/services/leaderboardService.ts` (nuevo servicio para consumir `/leaderboard/luck`).
  - `src/commands/economy/stats.ts` (nuevo campo en embed).
  - `src/commands/economy/top.ts` (nuevo comando registrado).
  - `src/commands/index.ts` (registro del comando `top`).
- **Documentación afectada:**
  - `docs/commands/economy.md`
  - `docs/features/cards.md`
  - `docs/integrations/backend-api.md`
- **APIs externas:** Consumo de `GET /leaderboard/luck` y lectura del campo `luck` en `GET /user/:discordId/stats`.
