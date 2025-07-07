import { Client } from 'discord.js';
import { clientEvents } from '@/events/client';
import { distubeEvents } from '@/events/distube';
import { DisTube } from 'distube';

/**
 * Registers all events for the client and DisTube
 * @param client client instance
 * @param distube DisTube instance
 */
export function registerAllEvents(client: Client, distube?: DisTube): void {
  // Registra los eventos del cliente
  for (const event of clientEvents) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  // Registra los eventos de DisTube (si se proporciona la instancia)
  if (distube) {
    for (const event of distubeEvents) {
      distube.on(event.name, (...args: any[]) => event.execute(...args));
    }
  }
}