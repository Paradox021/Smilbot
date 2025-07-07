// utils/globalMiddlewares.ts
import { Middleware } from '@/types/Middleware';

/**
 * Global middlewares that will be executed for every command
 */
export const globalMiddlewares: Middleware[] = [
  async (message, client, args, next) => {
    // Ejemplo: registro de logs para cada comando
    console.log(`Comando recibido: ${message.content}`);
    await next();
  },
  // Puedes agregar más middlewares globales según necesites
];