import * as cardService from "../services/cardService.js"
import { createEmbedCard, createEmbedText } from "../utils/embedCreator.js"

export const getCard = async (message) => {
    const card = await cardService.getCard()
    const embed = await createEmbedCard( 0x00569D, card[0])
    message.channel.send(embed)
}

export const createCard = async (message, args) => {
    if (message.member.roles.cache.some(role => role.name === "admin")) {
        const card = await cardService.createCard(message, args)
        const embed = await createEmbedCard( 0x00569D, card)
        message.channel.send(embed)
    } else {
        message.channel.send(createEmbedText( 0xFF0000, "You do not have the permission to do this!"))
    }
}