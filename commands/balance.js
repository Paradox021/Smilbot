// this command will return the user's balance
import { createEmbedText } from "../utils/embedCreator.js"
import * as userService from "../services/userService.js"

const balance = async (message) => {
    const auxUser = {
        discordId: message.author.id,
        username: message.author.username,
    }

    const user = await userService.getUser(auxUser)
    message.reply(createEmbedText( 0x00569D, `Your balance is: ${user.balance}`))
}

export { balance }