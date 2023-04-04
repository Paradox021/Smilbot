import * as cardService from "../services/cardService.js"
import { createEmbedCard, createEmbedText } from "../utils/embedCreator.js"

export const getCard = async (message) => {
    const card = await cardService.getCard()
    message.channel.send(createEmbedCard( 0x00569D, card[0]))
}

export const createCard = async (message, args) => {
    if (message.member.roles.cache.some(role => role.name === "admin")) {
        const card = await cardService.createCard(message, args)
        message.channel.send(createEmbedCard( 0x00569D, card))
    } else {
        message.channel.send(createEmbedText( 0xFF0000, "You do not have the permission to do this!"))
    }
}