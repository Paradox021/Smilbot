import { Command } from '@/types/Command';
import { ping } from './fun/ping';
import { play } from './distube/play';
import { stop } from './distube/stop';

/**
 * List of all commands
 */
export const commandList: Command[] = [
  ping,
  play,
  stop
];