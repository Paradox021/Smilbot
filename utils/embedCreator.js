import { EmbedBuilder, ButtonBuilder, ActionRowBuilder } from "@discordjs/builders";

const cardColors = {
    0: 0xFFFFFF,
    1: 0x0070DD,
    2: 0xA335EE,
    3: 0xFF8000,
    4: 0xC45039
}

const cardTypes = {
    0: "common",
    1: "rare",
    2: "epic",
    3: "legendary",
    4: "mythic"
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
            .setTitle(`${card.name} - ${cardTypes[card.type]}`)
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
                name:!card.count?card.name:`${card.name} - ${cardTypes[card.type]}`,
                value:card.count?`${card.count} cards`:`\`${cardTypes[card.type]}\``,
            }
        }))

    return {embeds: [embed], files:[], ephemeral: true}
}

// hace un embed que muestra una carta de forma detallada con tres botones, uno para ver la siguiente carta, otro para ver la anterior y otro para volver a la vista de lista
export async function createEmbedCardsDetailed(color, cards, position){

    const positionNumber = Number(position) + 1;
    const embed = new EmbedBuilder()
        .setColor(cardColors[cards[position].type])
        .setTitle(!cards[position].count?cards[position].name:`${cards[position].name} - ${cards[position].count} cards`)
        .setDescription(`**\`${cardTypes[cards[position].type]}\`**\n${cards[position].description}\n${positionNumber} of ${cards.length}`)
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
        .setLabel('Show my cards')
        .setStyle('Primary');

    const actionRow = new ActionRowBuilder()
        .addComponents(button);
    return {components: [actionRow]}
}

export function createOpenOtherCards(user){
    const button = new ButtonBuilder()
        .setCustomId('openOtherCards_'+user.id)
        .setLabel(`Show ${user.username}'s cards`)
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
                value:`@${offer.seller.username}\n- ${offer.cardId.name} \n- ${offer.price} coins \n`,
                }
            }
        ))
        .setFooter({ text: `Page ${positionNumber} of ${Math.floor(offers.length/11+1)}`});

    const buttonNext = new ButtonBuilder()
        .setCustomId('nextMarketPage')
        .setLabel('Next')
        .setStyle('Primary');

    const buttonPrevious = new ButtonBuilder()
        .setCustomId('previousMarketPage')
        .setLabel('Previous')
        .setStyle('Primary');

    if(position == 0) buttonPrevious.setDisabled(true);
    if(position == Math.floor(offers.length/11)) buttonNext.setDisabled(true);

    const actionRow = new ActionRowBuilder()
        .addComponents(buttonPrevious)
        .addComponents(buttonNext);
    const response = {embeds: [embed], components:[actionRow], ephemeral: true}
    return response

}

export function createEmbedSongQueue(color, songs){
    // if songs.length > 10 then we only show the first 10 songs
    const realLength = songs.length;
    if(realLength > 10) songs = songs.slice(0, 11);

    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle("**Server Queue**")
        .setTimestamp()
        .setFooter({ text: `There are ${realLength} songs in the queue`})
        .addFields(songs.map((song, i) => {
            if (i<10) return {
                name: `${i === 0 ? 'Playing:' : i+"."} ${song.name}`,
                value:`\`${song.formattedDuration}\``,
            }
            return {
                name: ` `,
                value:`\`${realLength - 10} more songs\``,
            }
        }))
    return {embeds: [embed]}

}

export function createEmbedHelp(color, commands){
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle("**Commands**")
        .setTimestamp()
        .setFooter({ text: `There are ${commands.length} commands`})
        .addFields(commands)
    return {embeds: [embed]}
}

export function createOpenAllCards(){
    const button = new ButtonBuilder()
        .setCustomId('openAllCards')
        .setLabel('show all cards')
        .setStyle('Primary');

    const actionRow = new ActionRowBuilder()
        .addComponents(button);
    return {components: [actionRow]}
}


