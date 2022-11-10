import { rollDice } from "../utils/roll"
export const roll = message => {
    message.channel.send(rollDice())
}