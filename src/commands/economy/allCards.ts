import { Message, Client } from 'discord.js';
import { Command } from '@/types/Command';
import { cardService } from '@/services/cardService';
import { createOpenAllCardsButton } from '@/components/buttons';
import { createTextEmbed } from '@/components/embeds';

/**
 * Command to display all available cards in the game
 * Usage: .allcards
 */
export const allCards: Command = {
  name: 'allcards',
  aliases: ['cards'],
  description: 'Shows all available cards in the game',

  async execute(message: Message, args: string[], client: Client): Promise<void> {
    // Get all cards
    const cards = await cardService.getAllCards();

    if (!cards || cards.length === 0) {
      await message.reply({
        embeds: [createTextEmbed(0x00569d, 'No cards exist in the game yet.')],
      });
      return;
    }

    // Send button to open all cards
    const button = createOpenAllCardsButton();

    await message.reply({
      content: `There are **${cards.length}** cards available in the game.`,
      components: [button],
    });
  },
};
