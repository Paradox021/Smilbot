import { createEmbedCardsDetailed, createEmbedListOfCards, createEmbedMarketList} from "./embedCreator.js"
import * as userService from "../services/userService.js"
import * as marketService from "../services/marketService.js"

const changeViewToDetailed = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, 0)
    interaction.update(embed)
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
    const position = await interaction.message.embeds[0].description.split('\n')[3].split(' ')[0]
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position)
    interaction.update(embed)
}

const previousCard = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const position = await interaction.message.embeds[0].description.split('\n')[3].split(' ')[0]
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedCardsDetailed( 0x00569D, cards.cards, position-2)
    interaction.update(embed)
}

const openCards = async (interaction) => {
    const auxUser = {
        discordId: interaction.user.id,
        username: interaction.user.username,
    }
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards)
    interaction.reply(embed)
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