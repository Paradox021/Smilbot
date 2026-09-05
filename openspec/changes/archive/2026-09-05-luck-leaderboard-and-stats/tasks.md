## 1. Tipos y Servicios de API

- [x] 1.1 Definir interfaces `UserLuckStats`, `RarityBreakdown` y `LuckLeaderboardResponse` en `src/services/userService.ts` (o servicio complementario) y verificar que compilen sin errores de TypeScript.
- [x] 1.2 Implementar método de consulta para `GET /leaderboard/luck` (`getLuckLeaderboard`) con soporte para parámetros `order`, `minPulls` y `limit`, verificando el contrato con la API.

## 2. Implementación de Comandos

- [x] 2.1 Actualizar `src/commands/economy/stats.ts` para renderizar el bloque `🎲 Gacha Luck` con rating, delta y desglose de rarezas (o mensaje amigable de tiradas insuficientes) y verificar formateo visual del embed.
- [x] 2.2 Crear el nuevo comando `top` en `src/commands/economy/top.ts` con soporte para subcomando `luck [worst]` y alias `.topluck` / `.lucktop`, formateando la tabla de posiciones con medallas.
- [x] 2.3 Registrar el comando `top` en `src/commands/index.ts` y verificar que esté accesible en el bot.

## 3. Documentación Técnica y Funcional (docs/)

- [x] 3.1 Actualizar `docs/commands/economy.md` documentando la sintaxis y ejemplos de `.top` / `.topluck` y la nueva sección de suerte en `.stats`.
- [x] 3.2 Actualizar `docs/integrations/backend-api.md` con el contrato del endpoint `GET /leaderboard/luck` y el campo `luck` en `GET /user/:discordId/stats`.
- [x] 3.3 Actualizar `docs/features/cards.md` detallando las métricas de suerte en gacha y la neutralización contra el mercado.

## 4. Verificación y Compilación

- [x] 4.1 Ejecutar compilación y verificación de tipos con `npm run build` (o `npx tsc --noEmit`) asegurando cero errores.
