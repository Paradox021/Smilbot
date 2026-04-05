// src/types/Client.d.ts
import 'discord.js';
import { Player } from 'discord-player';

/**
 * Augment the Client to include Player
 */
declare module 'discord.js' {
  export interface Client {
    player: Player;
  }
}