import { EmbedBuilder } from 'discord.js';
import { Card } from '@/services/cardService';
import { CardType, CardTypeLabel, CardTypeColor } from '@/types/CardType';
import { PaginationState, getPageItems } from '@/components/pagination';



/**
 * Extended card interface with optional count for user cards
 */
export interface CardWithCount extends Card {
  count?: number;
}

/**
 * Gets the color for a card based on its type
 */
export function getCardColor(card: CardWithCount): number {
  return CardTypeColor[card.type] ?? 0xffffff;
}

/**
 * Gets the type name for display
 */
export function getCardTypeName(card: CardWithCount): string {
  return CardTypeLabel[card.type] ?? 'Unknown';
}

/**
 * Creates an embed showing a list of cards with pagination
 * @param cards Array of cards to display
 * @param title Title for the embed
 * @param state Pagination state
 * @returns EmbedBuilder
 */
export function createCardListEmbed(
  cards: CardWithCount[],
  title: string,
  state: PaginationState
): EmbedBuilder {
  const pageCards = getPageItems(cards, state);

  const embed = new EmbedBuilder()
    .setColor(0x00569d)
    .setTitle(title)
    .setDescription(`Showing ${cards.length} cards`)
    .setFooter({
      text: `Page ${state.currentPage + 1} of ${state.totalPages}`,
    })
    .setTimestamp();

  // Add fields for each card on this page
  for (const card of pageCards) {
    const typeName = getCardTypeName(card);
    const value = card.count ? `${card.count} cards` : `\`${typeName}\``;

    embed.addFields({
      name: `${card.name} - ${typeName}`,
      value,
      inline: false,
    });
  }

  return embed;
}

/**
 * Creates an embed showing a single card in detailed view
 * @param cards Array of all cards
 * @param position Index of the card to display (0-based)
 * @returns EmbedBuilder
 */
export function createCardDetailedEmbed(
  cards: CardWithCount[],
  position: number
): EmbedBuilder {
  const card = cards[position];
  if (!card) {
    return new EmbedBuilder()
      .setColor(0xff0000)
      .setDescription('Card not found');
  }

  const typeName = getCardTypeName(card);
  const title = card.count ? `${card.name} - ${card.count} cards` : card.name;
  const imageUrl = card.imageUrl;

  const embed = new EmbedBuilder()
    .setColor(getCardColor(card))
    .setTitle(title)
    .setDescription(
      `**\`${typeName}\`**\n${card.description}\n${position + 1} of ${cards.length}`
    )
    .setTimestamp()
    .setFooter({ text: `Card by ${card.author}` });

  if (imageUrl) {
    embed.setImage(imageUrl);
  }

  return embed;
}

/**
 * Creates a simple text embed
 * @param color Color for the embed
 * @param text Text to display
 * @returns EmbedBuilder
 */
export function createTextEmbed(color: number, text: string): EmbedBuilder {
  return new EmbedBuilder().setColor(color).setDescription(text);
}

/**
 * Creates an embed showing a single card (used for buy/pull results)
 * @param card Card to display
 * @returns EmbedBuilder
 */
export function createCardEmbed(card: Card): EmbedBuilder {
  const color = CardTypeColor[card.type] ?? 0xffffff;
  const label = CardTypeLabel[card.type] ?? 'Unknown';

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(card.name)
    .setDescription(card.description)
    .setImage(card.imageUrl)
    .setFooter({ text: `Rarity: ${label} | Author: ${card.author}` });
}
