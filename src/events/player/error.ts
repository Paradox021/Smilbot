// src/events/player/error.ts
import { PlayerEvent } from '@/types/PlayerEvent';
import { GuildQueue } from 'discord-player';

export const error: PlayerEvent = {
  name: 'error',
  execute: (queue: GuildQueue, error: Error) => {
    console.error(`Player Error in ${queue.guild.name}:`, error);
  },
};
