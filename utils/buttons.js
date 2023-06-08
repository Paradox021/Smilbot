import { createEmbedCardsDetailed, createEmbedListOfCards, createEmbedMarketList} from "./embedCreator.js"
import * as userService from "../services/userService.js"
import * as marketService from "../services/marketService.js"
import { ButtonBuilder, ActionRowBuilder } from "@discordjs/builders"

const changeViewToDetailed = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, 0)

    const message = addButtonsForMyCards(cards.cards, 0, embed)

    interaction.update(message)
}

const changeViewToList = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards)
    
    interaction.update(embed)
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

const previousCard = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const position = await interaction.message.embeds[0].description.split('\n')[2].split(' ')[0]
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position-2)

    console.log("position: "+position)
    const message = addButtonsForMyCards(cards.cards, position-2, embed)

    interaction.update(message)
}

const openCards = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards)
    interaction.reply( embed )
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

export const buttons ={
    'changeViewToDetailed': changeViewToDetailed,   
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

        console.log("position: ", position)

        if(position == 0) buttonPrevious.setDisabled(true)
        if(position == cards.length - 1) buttonNext.setDisabled(true)
    
    const actionRow = new ActionRowBuilder()
        .addComponents(buttonPrevious)
        .addComponents(buttonBack)
        .addComponents(buttonNext);
    

    return { ...embed, components: [actionRow] }
}