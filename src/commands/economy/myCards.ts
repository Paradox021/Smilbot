import { Message, Client } from 'discord.js';
import { Command } from '@/types/Command';
import { userService } from '@/services/userService';
import { createOpenCardsButton } from '@/components/buttons';
import { createTextEmbed } from '@/components/embeds';
import { checkUser } from '@/middlewares/checkUser';

/**
 * Command to display own cards
 * Usage: .mycards or .cards
 */
export const myCards: Command = {
  name: 'mycards',
  aliases: [],
  description: 'Shows your card collection',
  middlewares: [checkUser],

  async execute(message: Message, args: string[], client: Client): Promise<void> {
    const userId = message.author.id;

    // Check if user has cards
    const userData = await userService.getMyCards(userId);

    if (!userData || !userData.cards || userData.cards.length === 0) {
      await message.reply({
        embeds: [createTextEmbed(0x00569d, 'You don\'t have any cards yet! Use `.getcard` to buy one.')],
      });
      return;
    }

    // Send button to open cards
    const button = createOpenCardsButton(userId, 'Show my cards');

    await message.reply({
      content: `You have **${userData.cards.length}** cards in your collection.`,
      components: [button],
    });
  },
};
