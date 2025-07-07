// src/events/distube/finish.ts
import { DistubeEvent } from '@/types/DistubeEvent';
import { Events } from 'distube';

/**
 * FFMPEG debug event
 */
export const ffmpegDebug: DistubeEvent = {
  name: Events.FFMPEG_DEBUG,
  execute: console.log
};