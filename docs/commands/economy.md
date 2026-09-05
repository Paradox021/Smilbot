# 💰 Referencia de Comandos: Economía y Cartas

Todos los comandos de esta categoría requieren el prefijo `.` por defecto y aplican el middleware `checkUser`.

---

## 1. `.dailybalance` / `.db`
* **Descripción:** Reclama tu recompensa diaria de 100 monedas y gestiona tu racha de días consecutivos.
* **Cooldown:** 23 horas.
* **Lógica de Racha:**
  * Si reclamas entre 23h y 48h tras el último reclamo, tu racha aumenta (+1).
  * Si pasas más de 48h, tu racha se reinicia a 1.
* **Ejemplo de uso:**
  ```text
  .dailybalance
  .db
  ```

---

## 2. `.balance` / `.bal`
* **Descripción:** Consulta tu saldo actual de monedas virtuales.
* **Ejemplo de uso:**
  ```text
  .balance
  .bal
  ```

---

## 3. `.stats` / `.profile` / `.estadisticas`
* **Descripción:** Muestra tu perfil económico completo, historial de ganancias/gastos, rachas diarias, conteo de cartas y métricas de suerte en gacha (`🎲 Gacha Luck`).
* **Secciones mostradas:**
  * **💰 Economy:** Balance actual, total ganado y total gastado históricamente.
  * **🔥 Daily Streaks:** Racha diaria actual, récord histórico y total de reclamos.
  * **🃏 Cards & Market:** Cartas en inventario, sobres/tiradas abiertas y ventas realizadas en el mercado.
  * **🎲 Gacha Luck:** Calificación de suerte (`Godly Luck`, `Lucky`, `Average`, `Unlucky`, `Cursed`), delta porcentual frente a la media (`+38.5%`) y desglose de cartas obtenidas (`18⚪ 11🟢 4🟣 2🟡 0🔴`). Si el usuario tiene menos de 20 tiradas, informa que requiere un mínimo de 20 tiradas para calcular su suerte.
* **Sintaxis:**
  ```text
  .stats             (Ver tus propias estadísticas)
  .stats @usuario    (Ver estadísticas de otro usuario)
  ```
* **Alias:** `.profile`, `.estadisticas`, `.mystats`.

---

## 4. `.getcard` / `.gc` / `.buycard`
* **Descripción:** Compra una tirada gacha de carta aleatoria por **100 monedas**.
* **Rarezas posibles:** Common (60%), Rare (25%), Epic (10%), Legendary (4%), Mythic (1%).
* **Ejemplo de uso:**
  ```text
  .getcard
  .gc
  ```

---

## 5. `.mycards`
* **Descripción:** Abre el visor interactivo con tu inventario personal de cartas.
* **Ejemplo de uso:**
  ```text
  .mycards
  ```

---

## 6. `.show <@usuario / ID>`
* **Descripción:** Permite ver la colección de cartas de otro jugador mediante el visor interactivo.
* **Ejemplo de uso:**
  ```text
  .show @Smil
  .show 123456789012345678
  ```

---

## 7. `.allcards`
* **Descripción:** Abre la enciclopedia global con todas las cartas existentes en el juego.
* **Ejemplo de uso:**
  ```text
  .allcards
  ```

---

## 8. `.market` / `.shop`
* **Descripción:** Abre el mercado del servidor actual para explorar y comprar cartas publicadas por otros usuarios.
* **Ejemplo de uso:**
  ```text
  .market
  .shop
  ```

---

## 9. `.top` / `.topluck` / `.lucktop`
* **Descripción:** Consulta el ranking (Top 5) de los jugadores con mayor o menor suerte en las tiradas gacha.
* **Cálculo justo y neutralización:** El backend neutraliza compras y ventas de mercado ($\text{Cartas Gacha} = \text{Inventario} - \text{Compras} + \text{Ventas}$) para medir únicamente la suerte de sobres abiertos.
* **Requisito mínimo:** Los usuarios deben tener al menos **20 tiradas** registradas para clasificar en el ranking.
* **Sintaxis:**
  ```text
  .top                     (Muestra el Top 5 con más suerte por defecto)
  .topluck                 (Alias directo para el Top 5 con más suerte)
  .top luck                (Top 5 con más suerte)
  .top luck worst          (Top 5 más desafortunados / con peor suerte)
  .topluck worst           (Alias directo para ver los más desafortunados)
  ```
* **Alias adicionales:** `.leaderboard`, `.ranking`.

