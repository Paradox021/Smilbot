import { Message, Client } from 'discord.js';
import { Command } from '@/types/Command';
import { marketService } from '@/services/marketService';
import { createOpenMarketButton } from '@/components/buttons';
import { createTextEmbed } from '@/components/embeds';
import { checkUser } from '@/middlewares/checkUser';

/**
 * Command to open the market
 * Usage: .market
 */
export const market: Command = {
  name: 'market',
  aliases: ['shop'],
  description: 'Opens the card marketplace',
  middlewares: [checkUser],

  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const serverId = message.guildId;

    if (!serverId) {
      await message.reply({
        embeds: [createTextEmbed(0xff0000, 'This command can only be used in a server.')],
      });
      return;
    }

    // Get offer count for info message
    const offers = await marketService.getAllOffers(serverId);

    // Send button to open market
    const button = createOpenMarketButton();

    const offerText = offers.length === 0
      ? 'The market is currently empty.'
      : `There are **${offers.length}** offers available.`;

    await message.reply({
      content: `🛒 **Card Market**\n${offerText}`,
      components: [button],
    });
  },
};
