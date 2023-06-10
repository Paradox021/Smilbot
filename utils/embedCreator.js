import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "@discordjs/builders";

const cardColors = {
    "common": 0xFFFFFF,
    "rare": 0x0070DD,
    "epic": 0xA335EE,
    "legendary": 0xFF8000,
    "mythic": 0xC45039
}

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
    
    try{
        
        const embed = new EmbedBuilder()
        .setColor(cardColors[card.type])
        .setTitle(`${card.name} - ${card.type}`)
        .setDescription(card.description)
        .setImage(card.imageUrl)
        .setTimestamp()
        .setFooter({ text: `Card by ${card.author}`});
    

    return {embeds: [embed]}
    }
    catch(err){
        console.log(err);
    }
    
}

export function createEmbedListOfCards(color, cards, title){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setTimestamp()
        .setFooter({ text: `You have ${cards.length} cards`})
        .addFields(cards.map(card => {
            return {
                name: card.name,
                value:`${card.count} cards`,
            }
        }))

    return {embeds: [embed], files:[], ephemeral: true}
}

// hace un embed que muestra una carta de forma detallada con tres botones, uno para ver la siguiente carta, otro para ver la anterior y otro para volver a la vista de lista
export async function createEmbedCardsDetailed(color, cards, position){

    const positionNumber = Number(position) + 1;
    const embed = new EmbedBuilder()
        .setColor(cardColors[cards[position].type])
        .setTitle(`${cards[position].name} - ${cards[position].count} cards`)
        .setDescription(`${cards[position].description}\n${cards[position].type}\n${positionNumber} of ${cards.length}`)
        .setImage(cards[position].imageUrl)
        .setTimestamp()
        .setFooter({ text: `Card by ${cards[position].author}`});

    return {embeds: [embed], ephemeral: true}
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

export function createOpenOtherCards(user){
    const button = new ButtonBuilder()
        .setCustomId('openOtherCards_'+user.id)
        .setLabel(`show ${user.username}'s cards`)
        .setStyle('Primary');

    const actionRow = new ActionRowBuilder()
        .addComponents(button);
    return {components: [actionRow]}
}

export function createOpenMarket(){
    const button = new ButtonBuilder()
        .setCustomId('openMarket')
        .setLabel('show market')
        .setStyle('Primary');

    const actionRow = new ActionRowBuilder()
        .addComponents(button);
    return {components: [actionRow]}
}

export function createEmbedMarketList(color, offers, position){
    const ofertas =[];
    const positionNumber = Number(position) + 1;
    for (let i = position*10; i < position*10 + 10; i++) {
        if(offers[i]) ofertas.push(offers[i]);
    }

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle('Market')
        .setDescription('Here you can buy cards')
        .setTimestamp()
        .addFields(ofertas.map(offer => {
            return {
                name: offer._id.toString(),
                value:`- ${offer.cardId.name} \n- ${offer.price} coins\n`,
                }
            }
        ))
        .setFooter({ text: `Page ${positionNumber} of ${Math.floor(offers.length/10+1)}`});

    const buttonNext = new ButtonBuilder()
        .setCustomId('nextMarketPage')
        .setLabel('Next')
        .setStyle('Primary');

    const buttonPrevious = new ButtonBuilder()
        .setCustomId('previousMarketPage')
        .setLabel('Previous')
        .setStyle('Primary');

    const actionRow = new ActionRowBuilder()
    if(position !== 0) actionRow.addComponents(buttonPrevious);
    if(Math.floor(offers.length/10)!=0 && position !== Math.floor(offers.length/10) - 1) actionRow.addComponents(buttonNext);
    const response = {embeds: [embed], ephemeral: true}
    if(Math.floor(offers.length/10)!=0) response.components = [actionRow];
    return response

}

export function createEmbedSongQueue(color, songs){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle("**Server Queue**")
        .setTimestamp()
        .setFooter({ text: `There are ${songs.length} songs in the queue`})
        .addFields(songs.map((song, i) => {
            return {
                name: `${i === 0 ? 'Playing:' : i+"."} ${song.name}`,
                value:`\`${song.formattedDuration}\``,
            }
        }))
    return {embeds: [embed]}

}


