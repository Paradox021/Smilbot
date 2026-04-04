import { userService } from '@/services/userService';
import { Command } from '@/types/Command';
import { createTextEmbed } from '@/components/embeds';
import { Colors, Message, Client } from 'discord.js';
import { checkUser } from '@/middlewares/checkUser';

/**
 * Balance command to check the user's current coin balance
 */
export const balance: Command = {
  name: 'balance',
  aliases: ['bal'],
  description: 'Shows your current coin balance',
  middlewares: [checkUser],
  execute: async (message: Message, args: string[], client: Client) => {
    const discordId = message.author.id;

    try {
      const user = await userService.getUser(discordId);

      message.reply({
        embeds: [
          createTextEmbed(
            Colors.Gold,
            `💰 **${message.author.username}**, your current balance is: **${user.balance}** coins`
          ),
        ],
      });
    } catch (err: any) {
      message.reply({
        embeds: [
          createTextEmbed(Colors.Red, 'An error occurred while fetching your balance.'),
        ],
      });
    }
  },
};
