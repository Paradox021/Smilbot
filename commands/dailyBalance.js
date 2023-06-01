// this command is called when the user types .dailyBalance
// it will give the user 100 coins and can only be used once every 23 hours

import { createEmbedText } from "../utils/embedCreator.js"
import * as userService from "../services/userService.js"

const dailyBalance = async (message) => {
    const auxUser = {
        discordId: message.author.id,
        username: message.author.username,
    }

    const user = await userService.getUser(auxUser)

    const res = await userService.dailyBalance(user.discordId)
    
    if(!res.ok) {
        message.reply(createEmbedText( 0xFF0000,  (await res.json()).error))
        return
    }
    const newUser = await res.json()
    message.reply(createEmbedText( 0x00569D,  `You have claimed your daily balance!\nYour new balance is: ${newUser.balance}`))
}

export { dailyBalance }