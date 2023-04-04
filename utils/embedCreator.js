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

export async function createEmbedCard(color, card){
    
    const response = await fetch(card.imageUrl);
    const buffer = await response.buffer();


    const imageName = card.imageUrl.split('/').pop();
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(card.name)
        .setDescription(card.description)
        .setImage('attachment://'+imageName)
        .setTimestamp()
        .setFooter({ text: `Card by ${card.author}`});
    
    const attachment = {
        name: imageName,
        attachment: buffer
    }

    return {embeds: [embed], files: [attachment]}
}

export function createEmbedText(color, desc){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(desc)
    return {embeds: [embed]}
}
