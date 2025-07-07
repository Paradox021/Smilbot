// src/types/Client.d.ts
import 'discord.js';
import { DisTube } from 'distube';

/**
 * Augment the Client to include DisTube
 */
declare module 'discord.js' {
  export interface Client {
    distube: DisTube;
  }
}