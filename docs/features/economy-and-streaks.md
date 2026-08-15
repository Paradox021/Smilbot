# 💰 Economía Virtual, Rachas y Analíticas

## 1. Modelo Económico

Smilbot cuenta con un sistema de monedas virtuales (*coins*) que los usuarios ganan mediante reclamos diarios o ventas en el mercado, y gastan en tiradas de cartas gacha (`.getcard`) o compras en el marketplace.

---

## 2. Sistema de Rachas (`dailyBalance`)

El comando `dailybalance` (alias `db`) permite a los usuarios reclamar **100 monedas** una vez al día.

### Reglas de Tiempo y Cooldown:
* **Cooldown mínimo:** **23 horas** desde el último reclamo (`lastDaily`). Si se intenta antes, la API rechaza la petición indicando el tiempo restante.
* **Ventana de Racha (23h a 48h):** Si el usuario reclama entre las 23h y las 48h posteriores a su último reclamo:
  $$\text{dailyStreak} = \text{previousStreak} + 1$$
* **Racha Rota (> 48h):** Si transcurren más de 48 horas sin reclamar:
  $$\text{dailyStreak} = 1$$
* **Récord Histórico:**
  $$\text{maxDailyStreak} = \max(\text{dailyStreak}, \text{previousMaxStreak})$$

### Lógica de Presentación en el Bot:
* **Racha activa ($\ge 2$ días):** Muestra el fueguito y conteo consecutivo (`🔥 Daily Streak: X days in a row!`).
* **Nuevo récord personal ($\ge 2$ días y supera récord):** Muestra felicitación especial (`🎉 New Personal Record!`).
* **Racha rota (día = 1 y racha previa $\ge 2$):** Avisa al usuario con tono amigable (`💔 Your previous streak of X days was broken`).
* **Primer reclamo / Reclamo estándar (1 día):** Notificación limpia de saldo sin spam de racha.

---

## 3. Analíticas y Perfil de Usuario (`stats`)

A través del endpoint `GET /user/:discordId/stats`, el bot genera un perfil completo con métricas acumuladas:

```json
{
  "discordId": "123456789012345678",
  "username": "Gamer123",
  "balance": 650,
  "dailyStreak": 7,
  "maxDailyStreak": 14,
  "totalDailiesClaimed": 42,
  "totalCoinsEarned": 5400,
  "totalCoinsSpent": 4750,
  "cardsCount": 35,
  "cardsOpenedCount": 30,
  "marketSalesCount": 5
}
```

Métricas calculadas:
1. **Total de monedas ganadas de por vida (`totalCoinsEarned`):** Suma acumulada de dailies y ventas en el mercado.
2. **Total de monedas gastadas de por vida (`totalCoinsSpent`):** Suma acumulada de compras de cartas gacha y compras en el mercado.
3. **Packs abiertos (`cardsOpenedCount`):** Número de cartas obtenidas mediante gacha.
4. **Ventas en mercado (`marketSalesCount`):** Cantidad de ofertas vendidas exitosamente.

---

## 4. Trazabilidad y Libro Mayor (Ledger)

En el backend, cada movimiento de saldo genera un registro inmutable en la colección `transactions`:
* `DAILY_CLAIM`: +100 monedas (incluye metadata de racha).
* `CARD_BUY`: -100 monedas (incluye metadata de la carta y rareza obtenida).
* `MARKET_BUY`: -precio (asociado a la oferta y vendedor).
* `MARKET_SELL`: +precio (asociado a la oferta y comprador).
* `ADMIN_ADJUST`: Ajustes administrativos y snapshot inicial de migración.
