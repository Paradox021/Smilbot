# 🃏 Sistema de Cartas Coleccionables y Gacha

## 1. Concepto

Smilbot incluye un sistema de cartas coleccionables donde los usuarios pueden adquirir cartas aleatorias, ver su inventario personal, inspeccionar la colección de otros usuarios y consultar el catálogo global.

---

## 2. Sistema Gacha (`.getcard`)

Al ejecutar `.getcard` (o alias `.gc`, `.buycard`), el usuario intercambia **100 monedas** por una carta generada aleatoriamente según probabilidades de rareza (*RNG roll* entre 0 y 999).

### Tabla de Probabilidades y Rarezas:

| Rareza | Type ID | Rango de Roll (0-999) | Probabilidad | Color |
| :--- | :--- | :--- | :--- | :--- |
| **Common** | `0` | 0 – 599 | **60.0%** | Gris (`#808080`) |
| **Rare** | `1` | 600 – 849 | **25.0%** | Azul (`#0080ff`) |
| **Epic** | `2` | 850 – 949 | **10.0%** | Púrpura (`#a335ee`) |
| **Legendary** | `3` | 950 – 989 | **4.0%** | Naranja (`#ff8000`) |
| **Mythic** | `4` | 990 – 999 | **1.0%** | Dorado (`#e6cc80`) |

---

## 3. Inventario y Visualizador de Cartas (`.mycards` / `.show`)

* **Agrupación de Duplicados:** Cuando un usuario posee múltiples copias de la misma carta, se agrupan mostrando el contador (ej. `Carta X - (x3)`).
* **Vistas Disponibles:**
  1. **Vista Lista (Paginada):** Muestra hasta 5 cartas por página con su nombre y rareza.
  2. **Vista Detallada:** Permite ver la ilustración a pantalla completa, la descripción y el autor de la carta.
* **Seguridad de Interacción:** Los botones del visor están protegidos para que solo el propietario o el invocador del comando pueda interactuar con la sesión de navegación.

---

## 4. Catálogo Global (`.allcards`)

Permite explorar todas las cartas creadas en el juego sin importar si el usuario las posee o no, funcionando como una enciclopedia interactiva para los coleccionistas.
