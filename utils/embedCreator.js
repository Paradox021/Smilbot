import { EmbedBuilder } from "@discordjs/builders";

export function createEmbedSong(color, title, song){
    const embed = new EmbedBuilder()
        .setColor(0x00569D)
        .setTitle('Now playing')
        .setDescription(`${song.name} - \`${song.formattedDuration}\``)
        .setThumbnail(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: `Requested by ${song.user.tag}`, iconURL: song.user.avatarURL() });
    return embed
}