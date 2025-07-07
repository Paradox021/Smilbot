// src/events/distube/playSong.ts
import { DistubeEvent } from '@/types/DistubeEvent';
import { Events, Queue, Song } from 'distube';
import { createEmbedSong } from '@/utils/embedCreator';

/**
 * Play song event
 */
export const playSong: DistubeEvent = {
  name: Events.PLAY_SONG,
  execute: (queue: Queue, song: Song) => {
    queue.textChannel?.send({ embeds: [createEmbedSong(0x00569D, 'Now playing', song)] });
  },
};