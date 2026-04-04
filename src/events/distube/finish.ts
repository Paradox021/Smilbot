// src/events/distube/finish.ts
import { DistubeEvent } from '@/types/DistubeEvent';
import { Events, Queue } from 'distube';
import { createTextEmbed } from '@/components/embeds';

/**
 * Finish event
 */
export const finish: DistubeEvent = {
  name: Events.FINISH,
  execute: (queue:Queue) => {
    queue.textChannel?.send({
        embeds: [createTextEmbed(0x85C734, 'No more songs in queue, leaving')],
    });
  },
};