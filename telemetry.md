# 📋 Especificación Técnica: Analíticas, Rachas y Auditoría Económica (Backend)

Este documento contiene la especificación completa para implementar el sistema de **trazabilidad económica (Ledger), rachas de `dailybalance` y analíticas de usuario** en el backend de **Smilbot**.

---

## 🎯 1. Objetivos del Backend

1. **Persistencia histórica (Ledger):** Registrar cada movimiento de monedas o cartas en una colección inmutable de transacciones.
2. **Sistema de Rachas (`dailyStreak`):** Calcular y registrar rachas consecutivas de reclamos diarios con tolerancia de tiempo.
3. **Métricas de Usuario:** Acumular estadísticas históricas (total de dinero ganado/gastado en la vida, cartas abiertas, etc.).
4. **Histórico del Mercado:** Mantener registros de ofertas vendidas o canceladas en lugar de eliminarlas directamente.
5. **Endpoints para Leaderboards y Estadísticas:** Proveer consultas agregadas para rankings y perfiles.

---

## 🗄️ 2. Modificaciones en Modelos de Base de Datos

### A. Modelo de Usuario (`User`)
Extender el esquema de usuario actual con los siguientes campos:

```typescript
interface UserCard {
  cardId: ObjectId | string;
  count: number;
}

interface UserSchema {
  discordId: string;
  username: string;
  balance: number;
  cards: UserCard[];
  lastDaily: Date | string | null;

  // --- NUEVOS CAMPOS ---
  dailyStreak: number;          // Racha actual (default: 0)
  maxDailyStreak: number;       // Racha récord alcanzada en tiempo real (default: 0)
  previousMaxStreak: number;    // Récord de la última racha rota / consolidada (default: 0)
  totalDailiesClaimed: number;  // Total de veces que ha reclamado el daily (default: 0)
  totalCoinsEarned: number;     // Monedas ganadas en toda la historia (default: 0)
  totalCoinsSpent: number;      // Monedas gastadas en toda la historia (default: 0)
  cardsOpenedCount: number;     // Total de cartas obtenidas por gacha (default: 0)
  createdAt: Date;
  updatedAt: Date;
}
```

---

### B. Nueva Colección: `Transaction` (Libro Mayor / Ledger)
Crear una colección/tabla `transactions` para registrar cualquier variación de saldo:

```typescript
export type TransactionType =
  | 'DAILY_CLAIM'      // Reclamo de dailybalance
  | 'CARD_BUY'         // Compra de carta gacha (.getcard)
  | 'MARKET_BUY'       // Compra en el mercado
  | 'MARKET_SELL'      // Ganancia por venta en el mercado
  | 'TRADE'            // Intercambio con otro usuario
  | 'ADMIN_ADJUST'     // Ajuste manual por moderador / evento

export interface TransactionSchema {
  _id: ObjectId | string;
  discordId: string;           // Usuario afectado
  type: TransactionType;
  amount: number;              // Positivo si gana dinero (+100), negativo si gasta (-100)
  balanceBefore: number;       // Saldo antes de la operación
  balanceAfter: number;        // Saldo resultante
  metadata?: {
    cardId?: string;           // ID de la carta involucrada (si aplica)
    cardType?: number;         // Rareza (0: Common, 1: Rare, 2: Epic, 3: Legendary, 4: Mythic)
    roll?: number;             // Número aleatorio obtenido en la tirada gacha (0-999)
    sellerDiscordId?: string;  // ID del vendedor (en compras de mercado)
    buyerDiscordId?: string;   // ID del comprador (en ventas de mercado)
    offerId?: string;          // ID de la oferta de mercado
    streakAtClaim?: number;    // Racha que tenía al reclamar el daily
    previousStreak?: number;   // Racha previa al reclamo
    previousMaxStreak?: number;// Racha récord previa consolidada
    isNewRecord?: boolean;     // true únicamente si hoy batió su récord anterior
    streakBroken?: boolean;    // true si tardó >48h y rompió una racha previa
  };
  createdAt: Date;
}
```
*💡 **Índices recomendados:** `{ discordId: 1, createdAt: -1 }`, `{ type: 1 }`.*

---

### C. Colección Independiente de Mercado (`MarketOffer`)
En lugar de embeber arrays en documentos de servidor o eliminar físicamente las ofertas al comprarse/cancelarse, cada oferta es un documento independiente en `market_offers`:

```typescript
export type MarketOfferStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED';

interface MarketOfferSchema {
  _id: ObjectId | string;
  serverId: string;            // ID del servidor de Discord (Guild ID)
  seller: ObjectId | string;   // Ref a 'User'
  sellerDiscordId: string;     // Discord ID del vendedor
  cardId: ObjectId | string;   // Ref a 'Card'
  price: number;               // Precio en monedas
  status: MarketOfferStatus;   // 'ACTIVE' | 'SOLD' | 'CANCELLED' (default: 'ACTIVE')
  buyer?: ObjectId | string | null; // Ref a 'User'
  buyerDiscordId?: string | null;
  soldPrice?: number | null;
  soldAt?: Date | null;
  cancelledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```
*💡 **Índices recomendados:** `{ serverId: 1, status: 1, createdAt: -1 }`, `{ seller: 1, status: 1 }`.*
*💡 **Nota:** Para el endpoint `GET /market/:serverId/offers`, filtrar únicamente las ofertas con `status: 'ACTIVE'`.*

---

## ⚙️ 3. Lógica de Negocio y Algoritmos

### A. Algoritmo de Cálculo de Racha (`dailybalance`)

Al ejecutar `POST /user/:discordId/dailyBalance`:

1. Obtener fecha actual (`now = new Date()`) y `lastDaily` del usuario.
2. Si `lastDaily` existe, calcular la diferencia en horas:
   $$\text{diffHours} = \frac{\text{now} - \text{lastDaily}}{1000 \times 60 \times 60}$$
3. **Comprobar Cooldown:**
   * Si $\text{diffHours} < 23$: **Rechazar con error 400** (Indicar tiempo restante para poder reclamar).
4. **Comprobar Racha y Consolidación de Récord Anterior:**
   * Si $\text{diffHours} \le 48$: **Mantiene la racha** $\rightarrow$ `dailyStreak = previousStreak + 1`.
   * Si $\text{diffHours} > 48$ (o primera vez): **Se rompe la racha** $\rightarrow$ consolida `previousMaxStreak = maxDailyStreak`, `dailyStreak = 1` y `streakBroken = true`.
5. **Detección de Nuevo Récord:**
   * `isNewRecord = previousMaxStreak > 0 && dailyStreak === previousMaxStreak + 1`. (Se activa **una única vez** al superar la marca).
6. **Actualizar Máxima Racha Histórica en Tiempo Real:**
   * `maxDailyStreak = Math.max(dailyStreak, maxDailyStreak)`.
7. **Actualizar Saldos y Estadísticas:**
   * `balance = balance + 100`
   * `totalCoinsEarned = totalCoinsEarned + 100`
   * `totalDailiesClaimed = totalDailiesClaimed + 1`
   * `lastDaily = now`
8. **Crear Registro en `Transaction`:**
   * `type: 'DAILY_CLAIM'`, `amount: +100`, `metadata: { streakAtClaim: dailyStreak, previousStreak, previousMaxStreak, isNewRecord, streakBroken }`.

---

### B. Registro de Compra de Carta Gacha (`POST /user/:discordId/card/random`)

1. Validar que `user.balance >= 100` (o el coste correspondiente).
2. Descontar saldo y sumar estadísticas:
   * `balance = balance - 100`
   * `totalCoinsSpent = totalCoinsSpent + 100`
   * `cardsOpenedCount = cardsOpenedCount + 1`
   * Añadir carta al array `cards`.
3. **Crear Registro en `Transaction`:**
   * `type: 'CARD_BUY'`, `amount: -100`, `metadata: { cardId: card._id, cardType: card.type, cardName: card.name, roll }`.

---

### C. Registro en Compras del Mercado (`POST /market/:serverId/offers/:offerId/buy`)

1. Validar que el comprador tiene saldo suficiente y que el vendedor no es el mismo comprador.
2. En una **transacción atómica** de base de datos:
   * Descontar `price` al comprador $\rightarrow$ Registrar `Transaction` con `type: 'MARKET_BUY'`, `amount: -price`.
   * Sumar `price` al vendedor $\rightarrow$ Registrar `Transaction` con `type: 'MARKET_SELL'`, `amount: +price`, y `totalCoinsEarned += price`.
   * Transferir la carta al comprador.
   * Marcar la oferta: `status = 'SOLD'`, `buyerDiscordId = buyer.discordId`, `soldPrice = price`, `soldAt = new Date()`.

---

## 🌐 4. Especificación de Endpoints (API REST)

### 1. Reclamo Diario (Actualizado)
* **Método:** `POST`
* **Ruta:** `/user/:discordId/dailyBalance`
* **Respuesta Exitosa (200 OK):**
```json
{
  "ok": true,
  "balance": 650,
  "dailyStreak": 11,
  "previousStreak": 10,
  "maxDailyStreak": 11,
  "previousMaxStreak": 10,
  "isNewRecord": true,
  "totalDailiesClaimed": 42
}
```

---

### 2. Estadísticas Globales del Usuario (Nuevo)
* **Método:** `GET`
* **Ruta:** `/user/:discordId/stats`
* **Respuesta Exitosa (200 OK):**
```json
{
  "discordId": "123456789012345678",
  "username": "Gamer123",
  "balance": 650,
  "dailyStreak": 11,
  "maxDailyStreak": 11,
  "previousMaxStreak": 10,
  "totalDailiesClaimed": 42,
  "totalCoinsEarned": 5400,
  "totalCoinsSpent": 4750,
  "cardsCount": 35,
  "cardsOpenedCount": 30,
  "marketSalesCount": 5,
  "luck": {
    "totalCards": 35,
    "luckPercentage": 138.5,
    "luckDelta": "+38.5%",
    "tier": "Lucky",
    "tierCode": "LUCKY",
    "eligibleForLeaderboard": true,
    "breakdown": {
      "common": 18,
      "rare": 11,
      "epic": 4,
      "legendary": 2,
      "mythic": 0
    }
  }
}
```

---

### 3. Historial de Transacciones del Usuario (Nuevo)
* **Método:** `GET`
* **Ruta:** `/user/:discordId/transactions?limit=10&page=1`
* **Respuesta Exitosa (200 OK):**
```json
{
  "transactions": [
    {
      "_id": "66bcde123...",
      "type": "DAILY_CLAIM",
      "amount": 100,
      "balanceBefore": 550,
      "balanceAfter": 650,
      "createdAt": "2026-08-14T11:00:00.000Z"
    },
    {
      "_id": "66bcde456...",
      "type": "CARD_BUY",
      "amount": -100,
      "balanceBefore": 650,
      "balanceAfter": 550,
      "createdAt": "2026-08-13T18:30:00.000Z"
    }
  ],
  "total": 52,
  "page": 1,
  "totalPages": 6
}
```

---

### 4. Tablas de Clasificación / Leaderboards (Nuevos)

#### A. Top Rachas Diarias
* **Método:** `GET`
* **Ruta:** `/leaderboard/streaks?type=current&limit=10` *(type: 'current' | 'max')*
* **Respuesta Exitosa (200 OK):**
```json
[
  { "discordId": "111...", "username": "Player1", "streak": 45 },
  { "discordId": "222...", "username": "Player2", "streak": 32 }
]
```

#### B. Top Dinero Ganado Histórico
* **Método:** `GET`
* **Ruta:** `/leaderboard/wealth?type=earned&limit=10` *(type: 'earned' | 'current')*
* **Respuesta Exitosa (200 OK):**
```json
[
  { "discordId": "111...", "username": "Player1", "amount": 25400 },
  { "discordId": "333...", "username": "Player3", "amount": 18200 }
]
```

#### C. Top Coleccionistas de Cartas
* **Método:** `GET`
* **Ruta:** `/leaderboard/cards?limit=10`
* **Respuesta Exitosa (200 OK):**
```json
[
  { "discordId": "111...", "username": "Player1", "cardsCount": 120 },
  { "discordId": "444...", "username": "Player4", "cardsCount": 98 }
]
```

#### D. Top Suerte en Gacha (Nuevo)
* **Método:** `GET`
* **Ruta:** `/leaderboard/luck?order=desc&minPulls=20&limit=10`
* **Parámetros Opcionales de Consulta (Query Params):**
  * `order`: `'desc'` (Default, jugadores más afortunados / *blessed*) o `'asc'` (jugadores más desafortunados / *cursed*).
  * `minPulls`: Umbral mínimo de cartas requeridas para calificar (Default: `20`). Evita que jugadores con pocas tiradas alteren el ranking.
  * `limit`: Máximo de usuarios a retornar (Default: `10`, máx: `100`).
* **Neutralización de Mercado:** Para garantizar justicia total y evitar que usuarios compren cartas en el mercado para inflar su suerte, el backend calcula:
  $$\text{Cartas Gacha} = \text{Inventario} - \text{Compras en Mercado} + \text{Ventas en Mercado}$$
* **Escala de Tiers en Inglés:**
  * `GODLY` (> +40% delta): *"Godly Luck"*
  * `LUCKY` (+15% a +40%): *"Lucky"*
  * `AVERAGE` (-15% a +15%): *"Average"*
  * `UNLUCKY` (-30% a -15%): *"Unlucky"*
  * `CURSED` (< -30% delta): *"Cursed"*
* **Respuesta Exitosa (200 OK):**
```json
{
  "order": "desc",
  "minPulls": 20,
  "leaderboard": [
    {
      "rank": 1,
      "discordId": "111...",
      "username": "LuckyPlayer",
      "totalCards": 45,
      "luckPercentage": 145.2,
      "luckDelta": "+45.2%",
      "tier": "Godly Luck",
      "tierCode": "GODLY",
      "breakdown": {
        "common": 20,
        "rare": 14,
        "epic": 7,
        "legendary": 3,
        "mythic": 1
      }
    }
  ]
}
```

---

---

## 📸 5. Snapshot de Apertura y Migración Histórica

Para asegurar la coherencia contable con los usuarios preexistentes, el script `scripts/backfillStatsAndLedger.js` crea una transacción de apertura `ADMIN_ADJUST` con un **Snapshot Génesis** en su `metadata`:

```json
{
  "type": "ADMIN_ADJUST",
  "amount": 16600,
  "balanceBefore": 0,
  "balanceAfter": 16600,
  "metadata": {
    "note": "Snapshot inicial de migración al Ledger (Genesis)",
    "migratedAt": "2026-08-15T00:45:00.000Z",
    "legacySnapshot": {
      "economy": {
        "initialBalance": 16600,
        "estimatedTotalEarned": 60900,
        "estimatedTotalSpent": 44300
      },
      "inventory": {
        "totalCards": 439,
        "distinctCardsCount": 27,
        "byRarity": { "common": 250, "rare": 130, "epic": 45, "legendary": 12, "mythic": 2 },
        "cardsBreakdown": [{ "cardId": "64a1...", "count": 5 }]
      },
      "gacha": { "estimatedCardsOpened": 440, "estimatedSpending": 44000 },
      "market": { "salesCount": 3, "totalEarnedFromSales": 1500, "purchasesCount": 2, "totalSpentOnPurchases": 300, "activeOffersAtMigration": 0 },
      "dailies": { "totalDailiesClaimed": 604, "lastDailyRecorded": "2026-08-14T20:00:00.000Z", "initialDailyStreak": 1 }
    }
  }
}
```

* **Simular cálculo sin escribir:** `npm run backfill:dry`
* **Aplicar cambios en MongoDB:** `npm run backfill`

---

## 🤖 6. Guía de Integración para el Bot de Discord

### A. Lógica para el comando Daily (`POST /user/:id/dailyBalance`)
```javascript
const res = await api.post(`/user/${discordId}/dailyBalance`)
const { balance, dailyStreak, previousStreak, maxDailyStreak, previousMaxStreak, isNewRecord } = res.data

if (isNewRecord) {
  // 🎉 ¡Nuevo récord personal batido! Superó su récord anterior de `previousMaxStreak` días
} else if (dailyStreak === 1 && previousStreak > 0) {
  // 💔 Se rompió la racha anterior de `previousStreak` días
} else {
  // 🔥 Racha mantenida normalmente (+1 día)
}
```

### B. Lógica para Tiradas de Gacha (`POST /user/:id/card/random`)
```javascript
const res = await api.post(`/user/${discordId}/card/random`)
const { name, type, roll } = res.data // roll es un número entre 0 y 999
```

