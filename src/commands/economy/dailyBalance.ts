import { economyService } from '@/services/economyService';
import { Command } from '@/types/Command';
import { createEmbedText } from '@/utils/embedCreator';
import { Colors, Message, Client } from 'discord.js';
import { checkUser } from '@/middlewares/checkUser';

/**
 * Daily Balance command to get the daily 100 coins
 */
export const dailyBalance: Command = {
    name: 'dailybalance',
    aliases: ['db'],
    description: 'Claim your daily 100 coins',
    middlewares: [checkUser],
    execute: async (message: Message, args: string[], client: Client) => {
      const discordId = message.author.id;

      const res = await economyService.claimDailyBalance(discordId);

      if (!res.ok) {
        message.reply({
          embeds: [
            createEmbedText(Colors.Red, res.error ?? 'Failed to claim your daily balance.'),
          ],
        });
        return;
      }

      message.reply({
        embeds: [
          createEmbedText(
            Colors.Blurple,
            `You have claimed your daily balance!\nYour new balance is: ${res.balance}`
          ),
        ],
      });
      
    }
  
};