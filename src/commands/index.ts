import { Command } from '@/types/Command';
import { ping } from './fun/ping';
import { play } from './distube/play';
import { stop } from './distube/stop';
import { balance } from './economy/balance';
import { dailyBalance } from './economy/dailyBalance';
import { getCard } from './economy/getCard';
import { myCards } from './economy/myCards';
import { show } from './economy/show';
import { allCards } from './economy/allCards';
import { market } from './economy/market';

/**
 * List of all commands
 */
export const commandList: Command[] = [
  ping,
  play,
  stop,
  balance,
  dailyBalance,
  getCard,
  myCards,
  show,
  allCards,
  market,
];