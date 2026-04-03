import { EmbedBuilder } from 'discord.js';
import { CardType, CardTypeLabel } from '@/types/CardType';
import { Card } from '@/services/cardService';

/**
 * Create an embed for a song
 * @param color color of the embed
 * @param title title of the embed
 * @param song song to create the embed for
 * @returns the created embed
 */
export function createEmbedSong(color: number, title: string, song: any) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(`[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
    .setThumbnail(song.thumbnail || null);
}

/**
 * Create an embed for text
 * @param color color of the embed
 * @param description description of the embed
 * @returns the created embed
 */
export function createEmbedText(color: number, description: string) {
  return new EmbedBuilder().setColor(color).setDescription(description);
}

const RarityColors: Record<CardType, number> = {
  [CardType.Common]: 0x808080, // Gray
  [CardType.Rare]: 0x0070dd,   // Blue
  [CardType.Epic]: 0xa335ee,   // Purple
  [CardType.Legendary]: 0xff8000, // Orange
  [CardType.Mythic]: 0xc45039, // Red
};

/**
 * Create an embed for a card
 * @param card card to create the embed for
 * @returns the created embed
 */
export function createEmbedCard(card: Card) {
  const color = RarityColors[card.type] ?? 0xFFFFFF;
  const label = CardTypeLabel[card.type] ?? 'Unknown';

  return new EmbedBuilder()
    .setColor(color)
    .setTitle(card.name)
    .setDescription(card.description)
    .setImage(card.imageUrl)
    .setFooter({ text: `Rarity: ${label} | Author: ${card.author}` });
}