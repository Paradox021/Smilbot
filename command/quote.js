export const quote = message => {
    inspirationalQuote().then(quote => message.channel.send(quote.text + " -"+(quote.author||"Anonymous")))
}