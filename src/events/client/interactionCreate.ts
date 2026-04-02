import { Event } from '@/types/Event';
import { Interaction, Client } from 'discord.js';
import { handleInteraction } from '@/handlers';

/**
 * Handle interactions (buttons, select menus, etc.)
 */
export const interactionCreate: Event = {
  name: 'interactionCreate',
  execute: async (interaction: Interaction, client: Client) => {
    await handleInteraction(interaction, client);
  },
};