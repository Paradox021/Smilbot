import { getInspirationalQuote } from "../services/quoteService.js"
export const quote = message => {
    getInspirationalQuote().then(quote => message.channel.send(quote.text + " -"+(quote.author||"Anonymous")))
}