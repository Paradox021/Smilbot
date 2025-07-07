// src/events/distube/finish.ts
import { DistubeEvent } from '@/types/DistubeEvent';
import { Events, Queue } from 'distube';
import { createEmbedText } from '@/utils/embedCreator';

/**
 * Finish event
 */
export const finish: DistubeEvent = {
  name: Events.FINISH,
  execute: (queue:Queue) => {
    queue.textChannel?.send({
        embeds: [createEmbedText(0x85C734, 'No more songs in queue, leaving')],
    });
  },
};