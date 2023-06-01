import { createEmbedCardsDetailed, createEmbedListOfCards} from "./embedCreator.js"
import * as userService from "../services/userService.js"

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

export const buttons ={
    'changeViewToDetailed': changeViewToDetailed,   
    'changeViewToList': changeViewToList,
    'nextCard': nextCard,
    'previousCard': previousCard,
    'openCards': openCards
}