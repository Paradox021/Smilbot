// types/Middleware.ts
import { Message } from 'discord.js';
import { Client } from 'discord.js';

/**
 * Middleware function type
 */
export type Middleware = (
  message: Message,
  client: Client,
  args: string[],
  next: () => Promise<void>
) => Promise<void>;