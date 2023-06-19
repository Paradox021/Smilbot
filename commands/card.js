import * as cardService from "../services/cardService.js"
import * as userService from "../services/userService.js"
import { createEmbedCard, createOpenCards, createEmbedText, createOpenOtherCards, createOpenAllCards } from "../utils/embedCreator.js"

const cardTypes = ["common", "rare", "epic", "legendary", "mythic"]

const getCard = async (message) => {
    const userId = message.author.id
    const auxUser = {
        discordId: userId,
        username: message.author.username,
    }
    const user = await userService.getUser(auxUser)
    const card = await cardService.getCard()
    if (user.balance < 100) {
        message.reply(createEmbedText( 0xFF0000, "You do not have enough money to do this!\nYou need 100 coins to buy a card!(Your balance is: " + user.balance + ")"))
        return
    }
    if(!card.length){
        message.reply(createEmbedText( 0xFF0000, "No cards available!"))
        return
    }
    await userService.removeBalance(userId, 100)
    const embed = await createEmbedCard( 0x00569D, card[0])
    await userService.addCard(userId, card[0]._id)
    message.reply(embed)
}

const createCard = async (message, args) => {
    
    if(args.length < 3 || !message.attachments.first() || !message.attachments.first().contentType.startsWith('image')){
        message.channel.send(createEmbedText( 0xFF0000, "You must specify the name, type, description and the image of the card!"))
        return
    }

    if (!cardTypes.includes(args[1])) {
        message.channel.send(createEmbedText( 0xFF0000, "You must specify a valid type! (common, rare, epic, legendary or mythic)"))
        return
    }
    
    if (message.member.roles.cache.some(role => role.name === "admin") || message.member.roles.cache.some(role => role.name === "ADMIN")) {
        const card = await cardService.createCard(message, args)
        if(!card){
            message.channel.send(createEmbedText( 0xFF0000, "Error creating the card!"))
            return
        }
        const embed = await createEmbedCard( 0x00569D, card)
        message.channel.send(embed)
    } else {
        message.channel.send(createEmbedText( 0xFF0000, "You do not have the permission to do this!"))
    }
}

const myCards = async (message) => {
    const button = await createOpenCards()
    message.reply(button)
}

const otherCards = async (message) => {
    const user = message.mentions.users.first()
    if (!user) {
        message.reply(createEmbedText( 0xFF0000, "You must mention a user to use this command!"))
        return
    }
    const button = await createOpenOtherCards(user)
    message.reply(button)
}

const getAllCards = async (message) => {
    const button = await createOpenAllCards()
    message.reply(button)
}


export { getCard, createCard, myCards, otherCards, getAllCards}