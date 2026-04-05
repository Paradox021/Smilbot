import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { registerAllEvents } from '@/events';
import { Player } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Crea la instancia de discord-player
const player = new Player(client);

// Carga los extractores por defecto (YouTube, Spotify, SoundCloud...)
player.extractors.loadMulti(DefaultExtractors);

client.player = player;

if (!client.player) {
  throw new Error('Player instance is not set up.');
}

// Registra todos los eventos en una sola llamada
registerAllEvents(client, player);

client.login(process.env.TOKEN).catch(console.error);