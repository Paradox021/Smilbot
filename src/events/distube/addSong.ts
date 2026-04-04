// src/events/distube/addSong.ts
import { DistubeEvent } from '@/types/DistubeEvent';
import { Events, Queue, Song } from 'distube';
import { createSongEmbed } from '@/components/embeds';

/**
 * Add song event
 */
export const addSong: DistubeEvent = {
  name: Events.ADD_SONG,
  execute: (queue:Queue, song:Song) => {
        queue.textChannel?.send({
            embeds: [createSongEmbed(0x85C734, 'Song added', song)],
        });
    },
};