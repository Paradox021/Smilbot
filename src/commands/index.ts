import { Command } from '@/types/Command';
import { ping } from './fun/ping';
import { play } from './distube/play';
import { stop } from './distube/stop';
import { dailyBalance } from './economy/dailyBalance';
import { getCard } from './economy/getCard';

/**
 * List of all commands
 */
export const commandList: Command[] = [
  ping,
  play,
  stop,
  dailyBalance,
  getCard
];