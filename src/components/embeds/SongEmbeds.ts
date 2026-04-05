import { EmbedBuilder } from 'discord.js';

/**
 * Creates an embed for a song
 * @param color Color of the embed
 * @param title Title of the embed
 * @param song Song to create the embed for
 * @returns EmbedBuilder
 */
export function createSongEmbed(color: number, title: string, song: any): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(`[${song.name || song.title}](${song.url}) - \`${song.formattedDuration || song.duration}\``)
    .setThumbnail(song.thumbnail || null);
}
