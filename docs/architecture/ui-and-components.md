# 🎨 Componentes e Interfaz de Usuario (UI)

Smilbot utiliza componentes nativos de Discord (Embeds, Botones de acción y menús interactivos) organizados bajo un patrón de fábrica en `src/components/`.

---

## 1. Embeds (`src/components/embeds/`)

### Tipos de Embeds principales:

* **Text Embed (`createTextEmbed`):**
  Genera un embed simple con un color semántico y descripción de texto (usado para mensajes de éxito, errores y notificaciones).
* **Card Embed (`createCardEmbed`):**
  Muestra una carta individual obtenida tras una tirada gacha con su imagen, color según rareza, nombre, descripción y autor.
* **Card List Embed (`createCardListEmbed`):**
  Muestra una página de la colección o del mercado en formato lista con paginador numérico.
* **Card Detailed Embed (`createCardDetailedEmbed`):**
  Muestra una carta específica dentro del visor interactivo de cartas.
* **Market Embeds (`MarketEmbeds.ts`):**
  Formato especializado para listas de ofertas del mercado de servidores con detalles de vendedor, precio y carta.

---

## 2. Paleta de Colores de Rarezas (`src/types/CardType.ts`)

Las cartas poseen una estética visual basada en su rareza:

| Rareza | Identificador | Nombre Mostrado | Color Hex | Color Entero |
| :--- | :--- | :--- | :--- | :--- |
| **0** | `COMMON` | `Common` | `#808080` (Gris) | `0x808080` |
| **1** | `RARE` | `Rare` | `#0080ff` (Azul) | `0x0080ff` |
| **2** | `EPIC` | `Epic` | `#a335ee` (Púrpura) | `0xa335ee` |
| **3** | `LEGENDARY` | `Legendary` | `#ff8000` (Naranja) | `0xff8000` |
| **4** | `MYTHIC` | `Mythic` | `#e6cc80` (Dorado Claro) | `0xe6cc80` |

---

## 3. Paginación Interactiva (`src/components/pagination/`)

La paginación se gestiona de forma desacoplada:
* `PaginationState`: Guarda `currentPage`, `pageSize` y `totalPages`.
* `getPageItems()`: Realiza el slicing en memoria del array de cartas u ofertas.
* `createPaginationButtons()`: Genera botones para navegar hacia adelante (`Next`), atrás (`Prev`) y cambiar entre vista de lista y vista detallada.

---

## 4. Handlers de Interacción con Estado (`src/handlers/`)

Cuando un usuario pulsa un botón en Discord:
1. Discord envía un `interactionCreate` con un `customId` estructurado (ej. `cards_next_${userId}`, `market_buy_${offerId}`).
2. `InteractionHandler` identifica el prefijo y despacha al handler correspondiente (`CardInteractions`, `MarketInteractions`, `HelpInteractions`).
3. El handler valida los permisos (ej. solo el usuario que abrió el menú puede interactuar con sus páginas) y actualiza el mensaje mediante `interaction.update()`.
