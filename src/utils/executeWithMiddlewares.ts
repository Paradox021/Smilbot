// utils/executeWithMiddlewares.ts
import { Message } from 'discord.js';
import { Client } from 'discord.js';
import { Middleware } from '@/types/Middleware';
import { Command } from '@/types/Command';
import { globalMiddlewares } from '@/utils/globalMiddlewares';
import { composeMiddlewares } from '@/utils/composedMiddlewares';
/**
 * Execute a command with its middlewares
 * @param message message that triggered the command
 * @param client discord client
 * @param command command to execute
 * @param args command arguments
 */
export async function executeWithMiddlewares(
    message: Message,
    client: Client,
    command: Command,
    args: string[]
  ): Promise<void> {
    const commandMiddlewares: Middleware[] = command.middlewares || [];
    const middlewares = [...globalMiddlewares, ...commandMiddlewares];
  
    const composed = composeMiddlewares(middlewares, async (msg, args, client) => {
      await command.execute(msg, args, client);
    });
  
    await composed(message, client, args);
  }