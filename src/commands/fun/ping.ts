import { Command } from '@/types/Command';
import { CommandCategory } from '@/types/CommandCategory';
import { Message, Client } from 'discord.js';

/**
 * Ping command to test if the bot is alive
 */
export const ping: Command = {
  name: 'ping',
  description: 'Replies with Pong!',
  categories: [CommandCategory.UTILITY],
  execute: async (message: Message, args: string[], client: Client) => {
    await message.reply('Pong!');
  },
  
};