import * as cardService from "../services/cardService.js"
import * as userService from "../services/userService.js"
import { createEmbedCard, createEmbedListOfCards, createEmbedText } from "../utils/embedCreator.js"

const getCard = async (message) => {
    const userId = message.author.id
    const auxUser = {
        discordId: userId,
        username: message.author.username,
    }
    const user = await userService.getUser(auxUser)
    if (user.balance < 100) {
        message.reply(createEmbedText( 0xFF0000, "You do not have enough money to do this!\nYou need 100 coins to buy a card!(Your balance is: " + user.balance + ")"))
        return
    }
    await userService.removeBalance(userId, 100)
    const card = await cardService.getCard()
    const embed = await createEmbedCard( 0x00569D, card[0])
    await userService.addCard(userId, card[0]._id)
    message.reply(embed)
}

const createCard = async (message, args) => {
    if (message.member.roles.cache.some(role => role.name === "admin")) {
        const card = await cardService.createCard(message, args)
        const embed = await createEmbedCard( 0x00569D, card)
        message.channel.send(embed)
    } else {
        message.channel.send(createEmbedText( 0xFF0000, "You do not have the permission to do this!"))
    }
}

const myCards = async (message) => {
    const auxUser = {
        discordId: message.author.id,
        username: message.author.username,
    }
    const cards = await userService.getMyCards(auxUser.discordId)
    const embed = await createEmbedListOfCards( 0x00569D, cards.cards)
    message.reply(embed)
}

export { getCard, createCard, myCards }