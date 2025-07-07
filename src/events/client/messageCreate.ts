import { Event } from '@/types/Event';
import { Message, Client } from 'discord.js';
import { commandList } from '@/commands';
import { executeWithMiddlewares } from '@/utils/executeWithMiddlewares';

/* Prefix for commands */
const prefix = '.';

/**
 * Execute a command when a message is created
 */
export const messageCreate: Event = {
  name: 'messageCreate',
  execute: async (message:Message, client:Client) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;

    const command = commandList.find(
      cmd => cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName))
    );
    if (!command) return;

    try {
      await executeWithMiddlewares(message, client, command, args);
    } catch (error) {
      console.error(`Error ejecutando el comando ${command.name}:`, error);
      await message.reply('Hubo un error al ejecutar ese comando.');
    }
  },
};