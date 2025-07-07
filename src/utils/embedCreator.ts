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