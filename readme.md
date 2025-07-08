# Smilbot

Smilbot es un bot de Discord enfocado en coleccionar cartas y gestionar una economia virtual entre los usuarios.

## Requisitos
- Node.js 18 o superior
- Una cuenta de Discord para obtener el token del bot

## Instalacion
1. Clona este repositorio y ejecuta `npm install` para instalar las dependencias.
2. Crea un archivo `.env` en la raiz con las siguientes variables:
   ```
   TOKEN=tu_token_de_discord
   API_URL=https://url.de.tu.backend
   ```
3. Inicia el bot con `npm run dev`. Tambien puedes compilarlo con `npm run build` y ejecutarlo en produccion con `npm start`.

## Uso basico
Los comandos utilizan el prefijo `.` segun se define en el codigo.

### Economia diaria
- `dailybalance`\: Reclama 100 monedas cada 23 horas.
- `balance`\: Consulta tu saldo actual.

### Sistema de cartas
- `getcard`\: Obtiene una carta aleatoria por 100 monedas.
- `mycards`\: Muestra tus cartas.
- `show <usuario>`\: Muestra las cartas de otro jugador.
- `cards`\: Lista todas las cartas disponibles.

### Mercado
- `market`\: Muestra las ofertas activas.
- `sell <carta> <precio>`\: Publica una carta a la venta.
- `buy <id>`\: Compra una oferta.
- `remove <id>`\: Elimina tu oferta.

Estos comandos te permiten gestionar tus cartas y participar en la economia del bot. Cualquier feedback es bienvenido.