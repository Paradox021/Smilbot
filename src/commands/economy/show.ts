import { Message, Client } from 'discord.js';
import { Command } from '@/types/Command';
import { userService } from '@/services/userService';
import { createOpenOtherCardsButton } from '@/components/buttons';
import { createTextEmbed } from '@/components/embeds';
import { checkUser } from '@/middlewares/checkUser';

/**
 * Command to display another user's cards
 * Usage: .show @user
 */
export const show: Command = {
  name: 'show',
  aliases: [],
  description: 'Shows another user\'s card collection',
  middlewares: [checkUser],

  async execute(message: Message, args: string[], client: Client): Promise<void> {
    // Get mentioned user
    const mentionedUser = message.mentions.users.first();

    if (!mentionedUser) {
      await message.reply({
        embeds: [createTextEmbed(0xff0000, 'Please mention a user! Usage: `.show @user`')],
      });
      return;
    }

    const userId = mentionedUser.id;
    const username = mentionedUser.username;

    // Check if target user has cards
    const userData = await userService.getMyCards(userId);

    if (!userData || !userData.cards || userData.cards.length === 0) {
      await message.reply({
        embeds: [createTextEmbed(0x00569d, `${username} doesn't have any cards yet.`)],
      });
      return;
    }

    // Send button to open cards
    const button = createOpenOtherCardsButton(userId, username);

    await message.reply({
      content: `**${username}** has **${userData.cards.length}** cards in their collection.`,
      components: [button],
    });
  },
};
