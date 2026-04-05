// src/events/player/emptyQueue.ts
import { PlayerEvent } from '@/types/PlayerEvent';
import { GuildQueue } from 'discord-player';
import { createTextEmbed } from '@/components/embeds';

export const emptyQueue: PlayerEvent = {
  name: 'emptyQueue',
  execute: (queue: GuildQueue<{ channel: any }>) => {
    queue.metadata?.channel?.send({
        embeds: [createTextEmbed(0x85C734, 'No more songs in queue, leaving')],
    });
  },
};
