// src/events/player/playerStart.ts
import { PlayerEvent } from '@/types/PlayerEvent';
import { GuildQueue, Track } from 'discord-player';
import { createSongEmbed } from '@/components/embeds';

export const playerStart: PlayerEvent = {
  name: 'playerStart',
  execute: (queue: GuildQueue<{ channel: any }>, track: Track) => {
    queue.metadata?.channel?.send({ embeds: [createSongEmbed(0x00569D, 'Now playing', track)] });
  },
};
