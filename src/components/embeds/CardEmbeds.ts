import { EmbedBuilder } from 'discord.js';
import { Card } from '@/services/cardService';
import { PaginationState, getPageItems } from '@/components/pagination';

/**
 * Color mapping for card rarities
 */
export const CARD_COLORS: Record<string, number> = {
  common: 0xffffff, // White/Gray
  rare: 0x0070dd, // Blue
  epic: 0xa335ee, // Purple
  legendary: 0xff8000, // Orange
  mythic: 0xc45039, // Red
};

/**
 * Numeric type to rarity name mapping
 */
export const CARD_TYPE_NAMES: Record<number, string> = {
  0: 'common',
  1: 'rare',
  2: 'epic',
  3: 'legendary',
  4: 'mythic',
};

/**
 * Extended card interface with optional count for user cards
 */
export interface CardWithCount extends Card {
  count?: number;
  imageUrl?: string;
}

/**
 * Gets the color for a card based on its type
 */
export function getCardColor(card: CardWithCount): number {
  // Handle both string and number types
  const typeName =
    typeof card.type === 'number' ? CARD_TYPE_NAMES[card.type] : card.type.toLowerCase();
  return CARD_COLORS[typeName] || 0xffffff;
}

/**
 * Gets the type name for display
 */
export function getCardTypeName(card: CardWithCount): string {
  if (typeof card.type === 'number') {
    return CARD_TYPE_NAMES[card.type] || 'unknown';
  }
  return card.type.toLowerCase();
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
  const imageUrl = card.imageUrl || card.image;

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
