import { userService } from '@/services/userService';
import { Command } from '@/types/Command';
import { CommandCategory } from '@/types/CommandCategory';
import { createTextEmbed } from '@/components/embeds';
import { Colors, EmbedBuilder, Message, Client } from 'discord.js';
import { checkUser } from '@/middlewares/checkUser';

/**
 * Stats command to check user's economic profile, streaks, and activity
 */
export const stats: Command = {
  name: 'stats',
  aliases: ['profile', 'estadisticas', 'mystats'],
  description: 'Shows user stats, balance, streaks, and card metrics',
  categories: [CommandCategory.ECONOMY],
  middlewares: [checkUser],
  execute: async (message: Message, args: string[], client: Client) => {
    const mentionedUser = message.mentions.users.first();
    const targetUser = mentionedUser ?? message.author;
    const discordId = targetUser.id;

    try {
      const userStats = await userService.getUserStats(discordId);

      const embed = new EmbedBuilder()
        .setColor(Colors.Gold)
        .setAuthor({
          name: `${userStats.username || targetUser.username}'s Profile & Stats`,
          iconURL: targetUser.displayAvatarURL(),
        })
        .addFields(
          {
            name: '💰 Economy',
            value: [
              `• Current Balance: **${(userStats.balance ?? 0).toLocaleString()}** coins`,
              `• Total Earned: **${(userStats.totalCoinsEarned ?? 0).toLocaleString()}** coins`,
              `• Total Spent: **${(userStats.totalCoinsSpent ?? 0).toLocaleString()}** coins`,
            ].join('\n'),
            inline: false,
          },
          {
            name: '🔥 Daily Streaks',
            value: [
              `• Current Streak: **${userStats.dailyStreak ?? 0}** days`,
              `• Max Record Streak: **${userStats.maxDailyStreak ?? 0}** days`,
              `• Dailies Claimed: **${userStats.totalDailiesClaimed ?? 0}** times`,
            ].join('\n'),
            inline: true,
          },
          {
            name: '🃏 Cards & Market',
            value: [
              `• Inventory: **${userStats.cardsCount ?? 0}** cards`,
              `• Packs Opened: **${userStats.cardsOpenedCount ?? 0}**`,
              `• Market Sales: **${userStats.marketSalesCount ?? 0}**`,
            ].join('\n'),
            inline: true,
          }
        )
        .setFooter({ text: 'Smilbot Economy' })
        .setTimestamp();

      message.reply({ embeds: [embed] });
    } catch (err: any) {
      console.error('[StatsCommand] error:', err?.response?.data || err?.message);
      const isSelf = targetUser.id === message.author.id;
      const errorMsg = isSelf
        ? 'Could not fetch your statistics at this moment.'
        : `Could not fetch statistics for **${targetUser.username}**.`;

      message.reply({
        embeds: [createTextEmbed(Colors.Red, errorMsg)],
      });
    }
  },
};
