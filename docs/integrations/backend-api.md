# 🔌 Integración con Backend API REST

Smilbot se comunica con la API REST del backend a través de instancias tipadas de `Axios` (`src/services/`).

La variable de entorno `BACKEND_URL` en `.env` define el host base de la API.

---

## 1. Servicios y Endpoints Consumidos

### A. Usuario y Estadísticas (`userService.ts`)

| Endpoint | Método | Descripción | Retorno |
| :--- | :--- | :--- | :--- |
| `/user` | `POST` | Crea un usuario inicial si no existe | `{ ok: boolean }` (409 si ya existe) |
| `/user/:discordId` | `GET` | Obtiene los datos básicos del usuario | `User` (balance, id, username) |
| `/user/:discordId/cards` | `GET` | Obtiene el usuario con cartas pobladas | `UserWithCards` |
| `/user/:discordId/stats` | `GET` | Estadísticas acumuladas y rachas | `UserStats` |

### B. Economía y Rachas (`economyService.ts`)

| Endpoint | Método | Descripción | Retorno |
| :--- | :--- | :--- | :--- |
| `/user/:discordId/dailyBalance` | `POST` | Reclama los 100 diarios y actualiza racha | `ClaimResponse` (balance, streaks, etc.) |

#### Formato de Respuesta de `dailyBalance`:
```json
{
  "ok": true,
  "balance": 650,
  "dailyStreak": 7,
  "previousStreak": 6,
  "maxDailyStreak": 14,
  "previousMaxStreak": 14,
  "totalDailiesClaimed": 42
}
```

### C. Cartas y Gacha (`cardService.ts`)

| Endpoint | Método | Descripción | Retorno |
| :--- | :--- | :--- | :--- |
| `/card` | `GET` | Catálogo de todas las cartas | `Card[]` |
| `/user/:discordId/card/random` | `POST` | Tirada gacha (descuenta 100 monedas) | `Card` |

### D. Mercado Libre (`marketService.ts`)

| Endpoint | Método | Descripción | Retorno |
| :--- | :--- | :--- | :--- |
| `/market/:serverId/offers` | `GET` | Ofertas activas en un servidor | `MarketOfferWithCard[]` |
| `/market/:serverId/offers/:offerId/buy` | `POST` | Compra de una oferta | `{ ok: boolean, message: string }` |

---

## 2. Manejo de Errores y Resiliencia

Los servicios capturan las respuestas de error del backend (`err.response.data.error`) y las devuelven en formato amigable para que los comandos puedan mostrar un Embed descriptivo en Discord (por ejemplo: saldo insuficiente, cooldown de daily activo, usuario sin permisos, etc.).
