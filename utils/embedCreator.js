import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "@discordjs/builders";

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

export function createEmbedListOfCards(color, cards){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle("Your cards")
        .setTimestamp()
        .setFooter({ text: `You have ${cards.length} cards`})
        .addFields(cards.map(card => {
            return {
                name: card.name,
                value:`${card.count} cards`,
            }
        }))
    
    const button = new ButtonBuilder()
        .setCustomId('changeViewToDetailed')
        .setLabel('cambiar vista')
        .setStyle('Primary');

    const actionRow = new ActionRowBuilder()
        .addComponents(button);
    

    return {embeds: [embed], components: [actionRow], files:[], ephemeral: true}
}

// hace un embed que muestra una carta de forma detallada con tres botones, uno para ver la siguiente carta, otro para ver la anterior y otro para volver a la vista de lista
export async function createEmbedCardsDetailed(color, cards, position){
    const response = await fetch(cards[position].imageUrl);
    const buffer = await response.buffer();
    const imageName = cards[position].imageUrl.split('/').pop();
    const positionNumber = Number(position) + 1;
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(cards[position].name)
        .setDescription(`${cards[position].description}
type: ${cards[position].type}
${cards[position].count} cards
${positionNumber} of ${cards.length}`)
        .setImage('attachment://'+imageName)
        .setTimestamp()
        .setFooter({ text: `Card by ${cards[position].author}`});

    const buttonNext = new ButtonBuilder()
        .setCustomId('nextCard')
        .setLabel('Next')
        .setStyle('Primary');

    const buttonPrevious = new ButtonBuilder()
        .setCustomId('previousCard')
        .setLabel('Previous')
        .setStyle('Primary');
        
    const buttonBack = new ButtonBuilder()
        .setCustomId('changeViewToList')
        .setLabel('cambiar vista')
        .setStyle('Primary');

    const attachment = {
        name: imageName,
        attachment: buffer
    }
    
    const actionRow = new ActionRowBuilder()
    if(position != 0) actionRow.addComponents(buttonPrevious);
    actionRow.addComponents(buttonBack);
    if(position != cards.length - 1) actionRow.addComponents(buttonNext);

    return {embeds: [embed], components: [actionRow], files: [attachment], ephemeral: true}
}

export function createEmbedText(color, desc){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setDescription(desc)
    return {embeds: [embed]}
}

export function createOpenCards(){
    const button = new ButtonBuilder()
        .setCustomId('openCards')
        .setLabel('show my cards')
        .setStyle('Primary');

    const actionRow = new ActionRowBuilder()
        .addComponents(button);
    return {components: [actionRow]}
}
