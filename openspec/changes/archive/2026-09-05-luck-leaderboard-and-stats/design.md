## Context

El bot Smilbot interactúa con una API backend externa (especificada en `telemetry.md`). La API provee:
1. `GET /user/:discordId/stats`: perfil de usuario extendido con el objeto `luck`.
2. `GET /leaderboard/luck?order=desc&minPulls=20&limit=5`: ranking de suerte neutralizado contra compras de mercado.

## Goals / Non-Goals

**Goals:**
- Extender el modelo de datos de usuario con interfaces tipadas en TypeScript para las estadísticas de suerte (`UserLuckStats`, `RarityBreakdown`).
- Crear el servicio de cliente de API para leaderboards (`leaderboardService.ts` o integración en `userService.ts`).
- Implementar el comando de ranking `top` (`src/commands/economy/top.ts`) con alias `.topluck` y `.lucktop`.
- Actualizar el comando `stats` (`src/commands/economy/stats.ts`) con la sección visual compacta `🎲 Gacha Luck`.
- Actualizar la documentación obligatoria según la regla de oro en `docs/`.

**Non-Goals:**
- Implementar los otros leaderboards del backend (`streaks`, `wealth`, `cards`) en esta fase, aunque el comando `top` queda estructurado para admitirlos fácilmente en el futuro.
- Modificar el backend ni alterar el algoritmo de cálculo de suerte (consumo exclusivo como cliente).

## Decisions

### 1. Estructura del comando: Híbrido `top` con subcomandos y alias directos
- **Decisión:** Registrar el comando como `top`, reconociendo argumentos como `luck` (por defecto si se usa el alias `.topluck`) y opciones `worst` / `bad` / `salados` para invertir el orden (`order=asc`).
- **Alternativas consideradas:**
  - *Comandos separados (`.topluck` y `.badluck`):* Fragmenta la interfaz en múltiples archivos y duplica lógica de renderizado de embeds.
  - *Solo `.top luck`:* Exige tipear más a los usuarios para el caso de uso más común.
- **Razón:** El enfoque híbrido da máxima agilidad al usuario habitual (`.topluck`) y prepara la arquitectura para otros rankings futuros (`.top streaks`).

### 2. Formato de Desglose de Rarezas en `.stats`
- **Decisión:** Emplear una línea horizontal de emojis de colores (`18⚪ 11🟢 4🟣 2🟡 0🔴`) para representar Common, Rare, Epic, Legendary y Mythic.
- **Alternativas consideradas:**
  - *Listar cada rareza en líneas separadas:* Haría el embed excesivamente largo y difícil de leer en pantallas móviles.
  - *Omitir el desglose:* Dejaría al usuario sin saber por qué obtuvo su calificación.
- **Razón:** Es compacto, llamativo visualmente y se integra perfectamente con el diseño existente del embed de estadísticas.

### 3. Manejo de Umbral Mínimo (`minPulls = 20`)
- **Decisión:** En `.stats`, si el usuario tiene menos de 20 tiradas (`eligibleForLeaderboard === false`), se muestra un mensaje informativo amigable indicando que no tiene suficientes tiradas para calcular su suerte. En el leaderboard, si la lista devuelta está vacía, se notifica claramente la falta de usuarios calificados.

## Risks / Trade-offs

- **[Riesgo: Respuesta vacía de la API de leaderboard]** $\rightarrow$ **Mitigación:** Capturar array vacío y responder con un embed explicativo amigable en lugar de fallar o mostrar un embed en blanco.
- **[Riesgo: Formateo de nombres o usuarios que no están en el servidor]** $\rightarrow$ **Mitigación:** La API devuelve el `username` y `discordId`, lo que permite mostrar mención `<@${item.discordId}>` o fallback a `item.username`.
