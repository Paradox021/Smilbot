import { EmbedBuilder } from 'discord.js';

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

const RarityColors: Record<string, number> = {
    common: 0x808080,    // Gray
    rare: 0x0000FF,      // Blue
    epic: 0x800080,      // Purple
    legendary: 0xFFA500, // Orange/Gold
    mythic: 0xFF0000,    // Red
};

/**
 * Create an embed for a card
 * @param card card to create the embed for
 * @returns the created embed
 */
export function createEmbedCard(card: any) {
    const color = RarityColors[card.type.toLowerCase()] || 0xFFFFFF; // Default to white if unknown

    return new EmbedBuilder()
        .setColor(color)
        .setTitle(card.name)
        .setDescription(card.description)
        .setImage(card.image)
        .setFooter({ text: `Rarity: ${card.type} | Author: ${card.author}` });
}