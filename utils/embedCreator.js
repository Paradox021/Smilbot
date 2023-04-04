import { EmbedBuilder } from "@discordjs/builders";

export function createEmbedSong(color, title, song){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(`${song.name} - \`${song.formattedDuration}\``)
        .setThumbnail(song.thumbnail)
        .setTimestamp()
        .setFooter({ text: `Requested by ${song.user.tag}`, iconURL: song.user.avatarURL() });
    return {embeds: [embed]}
}

export function createEmbedCard(color, card){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(card.name)
        .setDescription(card.description)
        .setThumbnail(card.imageUrl)
        .setTimestamp()
        .setFooter({ text: `Card by ${card.author}`});
    return {embeds: [embed]}
}

export function createEmbedText(color, desc){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(desc)
    return {embeds: [embed]}
}