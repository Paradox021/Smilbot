import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { registerAllEvents } from '@/events';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { YouTubePlugin } from '@distube/youtube';
import fs from 'fs'; 

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Crea la instancia de DisTube con la configuración deseada
const distube = new DisTube(client, {
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin(),
    new YouTubePlugin({
      cookies: JSON.parse(fs.readFileSync('./src/cookies.json', 'utf8'))
    }),
  ],
});

client.distube = distube;

if (!client.distube) {
  throw new Error('DisTube instance is not set up.');
}

// Registra todos los eventos (tanto del cliente como de DisTube) en una sola llamada
registerAllEvents(client, distube);

client.login(process.env.TOKEN).catch(console.error);