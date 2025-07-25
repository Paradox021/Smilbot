import { economyService } from '@/services/economyService';
import { Command } from '@/types/Command';
import { createEmbedText } from '@/utils/embedCreator';
import { Colors, Message, Client } from 'discord.js';

/**
 * Daily Balance command to get the daily 100 coins
 */
export const dailyBalance: Command = {
    name: 'dailybalance',
    aliases: ['db'],
    description: 'Reclama tu saldo diario de 100 monedas',
    middlewares: [],
    execute: async (message: Message, args: string[], client: Client) => {
      const discordId = message.author.id;

      const res = await economyService.claimDailyBalance(discordId);

      if (!res.ok) {
        message.reply({
          embeds: [
            createEmbedText(Colors.Red, res.error ?? 'Error al reclamar tu daily balance.'),
          ],
        });
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