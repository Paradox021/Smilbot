import { Command } from '@/types/Command';
import { Message, Client } from 'discord.js';

/**
 * Ping command to test if the bot is alive
 */
export const ping: Command = {
  name: 'ping',
  description: 'Responde con Pong!',
  execute: async (message: Message, args: string[], client: Client) => {
    await message.reply('Pong!');
  },
  
};