import { economyService } from '@/services/economyService';
import { Command } from '@/types/Command';
import { CommandCategory } from '@/types/CommandCategory';
import { createTextEmbed } from '@/components/embeds';
import { Colors, Message, Client } from 'discord.js';
import { checkUser } from '@/middlewares/checkUser';

/**
 * Daily Balance command to get the daily 100 coins
 */
export const dailyBalance: Command = {
    name: 'dailybalance',
    aliases: ['db'],
    description: 'Claim your daily 100 coins',
    categories: [CommandCategory.ECONOMY],
    middlewares: [checkUser],
    execute: async (message: Message, args: string[], client: Client) => {
      const discordId = message.author.id;

      const res = await economyService.claimDailyBalance(discordId);

      if (!res.ok) {
        message.reply({
          embeds: [
            createTextEmbed(Colors.Red, res.error ?? 'Failed to claim your daily balance.'),
          ],
        });
        return;
      }

      const streak = res.dailyStreak ?? 0;
      const prevStreak = res.previousStreak ?? 0;
      const prevMaxStreak = res.previousMaxStreak ?? 0;

      let description = `💰 You have claimed your daily **100** coins!\nYour new balance is: **${res.balance}** coins.`;

      if (streak >= 2 && streak > prevMaxStreak) {
        description += `\n\n🎉 **New Personal Record!** You've reached a streak of **${streak}** consecutive days!`;
      } else if (streak >= 2) {
        description += `\n\n🔥 **Daily Streak:** **${streak}** days in a row!`;
      } else if (streak === 1 && prevStreak >= 2) {
        description += `\n\n💔 Your previous streak of **${prevStreak}** days was broken. Starting a new streak today!`;
      }

      message.reply({
        embeds: [
          createTextEmbed(
            Colors.Blurple,
            description
          ),
        ],
      });
      
    }
  
};