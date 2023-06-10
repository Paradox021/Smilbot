import { createEmbedCardsDetailed, createEmbedListOfCards, createEmbedMarketList} from "./embedCreator.js"
import * as userService from "../services/userService.js"
import * as marketService from "../services/marketService.js"
import { ButtonBuilder, ActionRowBuilder } from "@discordjs/builders"

export function handleButtons(interaction){
    if (!interaction.isButton()) return;
    if(interaction.customId.startsWith('changeViewToDetailed')) changeViewToDetailed(interaction);
    if(interaction.customId.startsWith('openOtherCard')) openOtherCards(interaction);
    if(interaction.customId.startsWith('otherChangeViewToDetailed')) otherChangeViewToDetailed(interaction);
    if(interaction.customId.startsWith('otherChangeViewToList')) otherChangeViewToList(interaction);
    if(interaction.customId.startsWith('nextOtherCard')) nextOtherCard(interaction);
    if(interaction.customId.startsWith('previousOtherCard')) previousOtherCard(interaction);
    buttons.hasOwnProperty(interaction.customId) && buttons[interaction.customId](interaction); 
}

const changeViewToDetailed = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    let position = 0;
    const customId = interaction.customId.split('_');
    if(customId.length > 1){
        position = customId[1]
    }
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position)

    const message = addButtonsForMyCards(cards.cards, position, embed)

    interaction.update(message)
}

const otherChangeViewToDetailed = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    let position = 0;
    if(argsCustomId.length > 2){
        position = argsCustomId[2]
    }
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position, userId)
    const message = addButtonsForOtherCards(cards.cards, position, embed, userId)

    interaction.update(message)
}
    

const changeViewToList = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards, "Your cards")
    const position = interaction.message.embeds[0].description.split('\n')[2].split(' ')[0] - 1
    const message = await addButtonsForMyCardsList(embed, position)
    
    interaction.update(message)
}

const otherChangeViewToList = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards, "Cards of " + userId)
    const position = interaction.message.embeds[0].description.split('\n')[2].split(' ')[0] - 1
    const message = await addButtonsForOtherCardsList(embed, userId, position)

    interaction.update(message)
}

const nextCard = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const position = await interaction.message.embeds[0].description.split('\n')[2].split(' ')[0]
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position)

    const message = addButtonsForMyCards(cards.cards, position, embed)
    
    interaction.update(message)
}

const nextOtherCard = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const position = await interaction.message.embeds[0].description.split('\n')[2].split(' ')[0]
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position, userId)
    const message = addButtonsForOtherCards(cards.cards, position, embed, userId)

    interaction.update(message)
}

const previousCard = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const position = await interaction.message.embeds[0].description.split('\n')[2].split(' ')[0]
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position-2)

    const message = addButtonsForMyCards(cards.cards, position-2, embed)

    interaction.update(message)
}

const previousOtherCard = async (interaction) => {
    const argsCustomId = interaction.customId.split('_');
    const userId = argsCustomId[1];
    const cards = await userService.getMyCards(userId)
    const position = await interaction.message.embeds[0].description.split('\n')[2].split(' ')[0]
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position-2, userId)
    const message = addButtonsForOtherCards(cards.cards, position-2, embed, userId)

    interaction.update(message)
}

const openCards = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards, "Your cards")
    const message = await addButtonsForMyCardsList(embed) 
    interaction.reply( message )
}

const openOtherCards = async (interaction) => {
    const userId = interaction.customId.split('_')[1]
    const cards = await userService.getMyCards(userId)
    const username = await interaction.guild.members.fetch(userId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards, `${username.user.username}'s cards`)
    const message = await addButtonsForOtherCardsList(embed, userId)
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

const buttons ={  
    'changeViewToList': changeViewToList,
    'nextCard': nextCard,
    'previousCard': previousCard,
    'openCards': openCards,
    'openMarket': openMarket,
    'nextMarketPage': nextMarketPage,
    'previousMarketPage': previousMarketPage,
}



function addButtonsForMyCards(cards, position, embed){
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

        if(position == 0) buttonPrevious.setDisabled(true)
        if(position == cards.length - 1) buttonNext.setDisabled(true)
    
    const actionRow = new ActionRowBuilder()
        .addComponents(buttonPrevious)
        .addComponents(buttonBack)
        .addComponents(buttonNext);
    

    return { ...embed, components: [actionRow] }
}

function addButtonsForMyCardsList(embed, position){
    const button = new ButtonBuilder()
        .setCustomId('changeViewToDetailed')
        .setLabel('cambiar vista')
        .setStyle('Primary');
    if(position) button.setCustomId('changeViewToDetailed_'+position)

    const actionRow = new ActionRowBuilder()
        .addComponents(button);

    return { ...embed, components: [actionRow] }

}

function addButtonsForOtherCardsList(embed, userId, position){
    const button = new ButtonBuilder()
        .setCustomId('otherChangeViewToDetailed_'+userId)
        .setLabel('cambiar vista')
        .setStyle('Primary');
    if(position) button.setCustomId('otherChangeViewToDetailed_'+`${userId}_`+position)

    const actionRow = new ActionRowBuilder()
        .addComponents(button);

    return { ...embed, components: [actionRow] }


}

function addButtonsForOtherCards( cards, position, embed, userId){
    const buttonNext = new ButtonBuilder()
        .setCustomId('nextOtherCard_'+userId)
        .setLabel('Next')
        .setStyle('Primary');

    const buttonPrevious = new ButtonBuilder()
        .setCustomId('previousOtherCard_'+userId)
        .setLabel('Previous')
        .setStyle('Primary');
        
    const buttonBack = new ButtonBuilder()
        .setCustomId('otherChangeViewToList_'+userId)
        .setLabel('cambiar vista')
        .setStyle('Primary');

        if(position == 0) buttonPrevious.setDisabled(true)
        if(position == cards.length - 1) buttonNext.setDisabled(true)
    
    const actionRow = new ActionRowBuilder()
        .addComponents(buttonPrevious)
        .addComponents(buttonBack)
        .addComponents(buttonNext);
    

    return { ...embed, components: [actionRow] }
}