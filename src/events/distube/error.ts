// src/events/distube/finish.ts
import { DistubeEvent } from '@/types/DistubeEvent';
import { Events, Queue, Song } from 'distube';

/**
 * Error event
 */
export const error: DistubeEvent = {
  name: Events.ERROR,
  execute: (error:Error, queue:Queue, song:Song) => {
    console.error('Distube error:', error);
  },
};