const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js')
const fetch = require("node-fetch");
const prefix = '!'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})

let auth = require('./auth.json');

client.on("ready", () => {
    console.log(`bot is online as ${client.user.tag}!`)

    client.user.setActivity(`busy being Smilbot!!`)
})

client.on("messageCreate", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return


    const args = message.content.slice(prefix.length).split(/ +/)

    const command = args.shift().toLowerCase()

   
    
    if(command === 'ping') message.channel.send('pong!')

    if(command === 'roll') message.channel.send(rollDice())

    if(command === 'quote') inspirationalQuote().then(quote => message.channel.send(quote.text + " -"+quote.author||"Anonymous"))
    
    if(command === 'cat') getCat().then(imageUrl => message.channel.send({files:[imageUrl]}))

})
client.login(auth.token)

function rollDice(){
    return (Math.floor(Math.random()*101)).toString()
}

function inspirationalQuote(){
    return fetch("https://type.fit/api/quotes")
    .then(response => response.json())
    .then(data => data[Math.floor(Math.random() * 1500)])
}

function getCat(){
    return fetch("https://api.thecatapi.com/v1/images/search")
    .then(response => response.json())
    .then(data => data[0].url)
}