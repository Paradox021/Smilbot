import { Client } from 'discord.js';
import { clientEvents } from '@/events/client';
import { playerEvents } from '@/events/player';
import { Player } from 'discord-player';

/**
 * Registers all events for the client and Player
 * @param client client instance
 * @param player Player instance
 */
export function registerAllEvents(client: Client, player?: Player): void {
  // Registra los eventos del cliente
  for (const event of clientEvents) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  // Registra los eventos de discord-player (si se proporciona la instancia)
  if (player) {
    for (const event of playerEvents) {
      player.events.on(event.name as any, (...args: any[]) => event.execute(...args));
    }
  }
}