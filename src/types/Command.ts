import { Client, Message } from 'discord.js';
import { Middleware } from './Middleware';

/**
 * Command interface
 */
export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  middlewares?: Middleware[];
  execute: (message: Message, args: string[], client: Client) => Promise<void> | void;
}