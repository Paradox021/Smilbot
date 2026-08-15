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
* **Descripción:** Muestra tu perfil económico completo, historial de ganancias/gastos, rachas diarias y conteo de cartas.
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
