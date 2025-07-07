// src/events/distube/finish.ts
import { DistubeEvent } from '@/types/DistubeEvent';
import { Events, Queue } from 'distube';

/**
 * Delete queue event
 */
export const deleteQueue: DistubeEvent = {
  name: Events.DELETE_QUEUE,
  execute: (queue:Queue) => {
    queue.voice?.leave();
  },
};