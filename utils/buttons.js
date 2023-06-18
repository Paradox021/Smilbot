import { createEmbedCardsDetailed, createEmbedListOfCards, createEmbedMarketList, createEmbedText } from "./embedCreator.js"
import * as userService from "../services/userService.js"
import * as marketService from "../services/marketService.js"
import { ButtonBuilder, ActionRowBuilder } from "@discordjs/builders"

export function handleButtons(interaction){
    if (!interaction.isButton()) return;
    if(interaction.customId.startsWith('openOtherCard')) openOtherCards(interaction);
    if(interaction.customId.startsWith('changeViewToDetailed')) changeViewToDetailed(interaction);
    if(interaction.customId.startsWith('changeViewToList')) changeViewToList(interaction);
    if(interaction.customId.startsWith('nextCard')) nextCard(interaction);
    if(interaction.customId.startsWith('previousCard')) previousCard(interaction);
    if(interaction.customId.startsWith('firstCard')) firstCard(interaction);
    if(interaction.customId.startsWith('lastCard')) lastCard(interaction);
    buttons.hasOwnProperty(interaction.customId) && buttons[interaction.customId](interaction); 
}

const changeViewToDetailed = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    let position = 0;
    if(argsCustomId.length > 2){
        position = argsCustomId[2]
    }
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position, userId)
    const message = addButtonsForCardsDetailed(cards.cards, position, embed, userId)

    interaction.update(message)
}
    

const changeViewToList = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const username = await interaction.guild.members.fetch(userId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards, `${username.user.username}'s cards`)
    const position = interaction.message.embeds[0].description.split('\n')[2].split(' ')[0] - 1
    const message = await addButtonsForCardsList(embed, userId, position)

    interaction.update(message)
}

const nextCard = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const position = await interaction.message.embeds[0].description.split('\n')[2].split(' ')[0]
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position, userId)
    const message = addButtonsForCardsDetailed(cards.cards, position, embed, userId)

    interaction.update(message)
}

const previousCard = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const position = await interaction.message.embeds[0].description.split('\n')[2].split(' ')[0]
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position-2, userId)
    const message = addButtonsForCardsDetailed(cards.cards, position-2, embed, userId)

    interaction.update(message)
}

const firstCard = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, 0, userId)
    const message = addButtonsForCardsDetailed(cards.cards, 0, embed, userId)

    interaction.update(message)
}

const lastCard = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, cards.cards.length-1, userId)
    const message = addButtonsForCardsDetailed(cards.cards, cards.cards.length-1, embed, userId)

    interaction.update(message)
}

const openCards = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const cards = await userService.getMyCards(auxUser.discordId)
    if(!cards){
        interaction.reply({...createEmbedText(0x00569D, 'You have no cards'), ephemeral: true})
        return
    }
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards, `${auxUser.username}'s cards`)
    const message = await addButtonsForCardsList(embed, auxUser.discordId) 
    interaction.reply( message )
}

const openOtherCards = async (interaction) => {
    const userId = interaction.customId.split('_')[1]
    const cards = await userService.getMyCards(userId)
    if(!cards){
        interaction.reply({...createEmbedText(0x00569D, 'This user has no cards'), ephemeral: true})
        return
    }
    const username = await interaction.guild.members.fetch(userId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards, `${username.user.username}'s cards`)
    const message = await addButtonsForCardsList(embed, userId)
    interaction.reply( message )
}

const openMarket = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        serverId: interaction.guild.id,
        username: interaction.user.username,
    }
    const offers = await marketService.getAllOffers(auxUser.serverId)
    const embed = await createEmbedMarketList( 0x00569D, offers, 0)
    interaction.reply(embed)
}

const nextMarketPage = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        serverId: interaction.guild.id,
        username: interaction.user.username,
    }
    const position = await interaction.message.embeds[0].footer.text.split(' ')[1]
    const offers = await marketService.getAllOffers(auxUser.serverId)
    const embed = await createEmbedMarketList( 0x00569D, offers, position)
    interaction.update(embed)
}

const previousMarketPage = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        serverId: interaction.guild.id,
        username: interaction.user.username,
    }
    const position = await interaction.message.embeds[0].footer.text.split(' ')[1]
    const offers = await marketService.getAllOffers(auxUser.serverId)
    const embed = await createEmbedMarketList( 0x00569D, offers, position-2)
    interaction.update(embed)
}

const buttons = { 
    'openCards': openCards,
    'openMarket': openMarket,
    'nextMarketPage': nextMarketPage,
    'previousMarketPage': previousMarketPage,
}

function addButtonsForCardsList(embed, userId, position){
    const button = new ButtonBuilder()
        .setCustomId('changeViewToDetailed_'+userId)
        .setLabel('cambiar vista')
        .setStyle('Primary');
    if(position) button.setCustomId('changeViewToDetailed_'+`${userId}_`+position)

    const actionRow = new ActionRowBuilder()
        .addComponents(button);

    return { ...embed, components: [actionRow] }


}

function addButtonsForCardsDetailed( cards, position, embed, userId){
    const buttonNext = new ButtonBuilder()
        .setCustomId('nextCard_'+userId)
        .setLabel('Next')
        .setStyle('Primary');

    const buttonPrevious = new ButtonBuilder()
        .setCustomId('previousCard_'+userId)
        .setLabel('Previous')
        .setStyle('Primary');
        
    const buttonBack = new ButtonBuilder()
        .setCustomId('changeViewToList_'+userId)
        .setLabel('cambiar vista')
        .setStyle('Primary');
    
    const buttonFirst = new ButtonBuilder()
        .setCustomId('firstCard_'+userId)
        .setLabel('First')
        .setStyle('Primary');

    const buttonLast = new ButtonBuilder()
        .setCustomId('lastCard_'+userId)
        .setLabel('Last')
        .setStyle('Primary');

        if(position == 0) buttonPrevious.setDisabled(true)
        if(position == cards.length - 1) buttonNext.setDisabled(true)
        if(position == 0) buttonFirst.setDisabled(true)
        if(position == cards.length - 1) buttonLast.setDisabled(true)
    
    const actionRow = new ActionRowBuilder()
        .addComponents(buttonFirst)
        .addComponents(buttonPrevious)
        .addComponents(buttonBack)
        .addComponents(buttonNext)
        .addComponents(buttonLast);
    
    return { ...embed, components: [actionRow] }
}