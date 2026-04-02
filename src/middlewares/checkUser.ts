import { Middleware } from '@/types/Middleware';
import { userService } from '@/services/userService';

export const checkUser: Middleware = async (message, client, args, next) => {
  const user = {
    discordId: message.author.id,
    username: message.author.username,
  };

  try {
    await userService.createUser(user);
    await next();
  } catch (error:any) {
    console.error('[Middleware] checkUser error:', error.data.error);
    message.reply('Error al verificar tu usuario. Intenta de nuevo más tarde.');
  }
};
