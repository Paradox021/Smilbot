// utils/composeMiddlewares.ts
import { Message } from 'discord.js';
import { Client } from 'discord.js';
import { Middleware } from '@/types/Middleware';

/**
 * Compone un arreglo de middlewares y una función final (por ejemplo, la ejecución del comando)
 * en una única función que encadena la ejecución de todos ellos.
 *
 * @param middlewares - Arreglo de middlewares a ejecutar.
 * @param final - Función que se ejecuta al finalizar todos los middlewares.
 * @returns Una función que recibe message, client y args, y ejecuta la cadena completa.
 */
export function composeMiddlewares(
  middlewares: Middleware[],
  final: (message: Message, args: string[], client: Client) => Promise<void>
): (message: Message, client: Client, args: string[]) => Promise<void> {
  return async (message, client, args) => {

    async function dispatch(i: number): Promise<void> {
      if (i < middlewares.length) {
        const middleware = middlewares[i];
        // Llama al middleware pasando una función next que invoca al siguiente
        await middleware(message, client, args, () => dispatch(i + 1));
      } else {
        await final(message, args, client);
      }
    }

    await dispatch(0);
  };
}