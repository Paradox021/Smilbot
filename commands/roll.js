import { rollDice } from "../utils/roll.js"
export const roll = message => {
    message.channel.send(rollDice())
}