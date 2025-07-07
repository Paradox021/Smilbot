import { Event } from '@/types/Event';
import { Interaction, Client } from 'discord.js';

/**
 * Handle interactions
 */
export const interactionCreate: Event = {
  name: 'interactionCreate',
  execute: (interaction: Interaction, client: Client) => {
    // Lógica para manejar la interacción
  },
};