// src/events/player/audioTrackAdd.ts
import { PlayerEvent } from '@/types/PlayerEvent';
import { GuildQueue, Track } from 'discord-player';
import { createSongEmbed } from '@/components/embeds';

export const audioTrackAdd: PlayerEvent = {
  name: 'audioTrackAdd',
  execute: (queue: GuildQueue<{ channel: any }>, track: Track) => {
    queue.metadata?.channel?.send({
        embeds: [createSongEmbed(0x85C734, 'Song added to queue', track)],
    });
  },
};
