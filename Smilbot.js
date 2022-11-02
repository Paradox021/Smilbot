const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js')
const fetch = require("node-fetch");
const prefix = '.'
const { DisTube } = require('distube')

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})

client.distube = new DisTube(client, {
    leaveOnEmpty: true,
    leaveOnStop: true,
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false
  })

const commands = {
    'ping': message => {
        message.channel.send('pong!')
    },
    'roll': message => {
        message.channel.send(rollDice())
    },
    'quote': message => {
        inspirationalQuote().then(quote => message.channel.send(quote.text + " -"+quote.author||"Anonymous"))
    },
    'cat': message => {
        getCat().then(imageUrl => message.channel.send({files:[imageUrl]}))
    },
    'play': (message, args) =>{
        if (!message.member.voice.channel) {
            message.channel.send(`${message.author} you must be in a voice channel to do this! `);
            return;
        }
        client.distube.play(message.member.voice.channel, args.join(" "), {
                member: message.member,
                textChannel: message.channel,
                message
        })
    },
    'stop' : message => {
        if (!message.member.voice.channel) {
            message.channel.send(`${message.author} you must be in a voice channel to do this! `);
            return;
        }
        try {
            client.distube.stop(message);
            message.channel.send("Stopped the queue!");
        } catch (error) {
            console.error(e.name, e.message)
        }
    },
    'skip': message => {
        if (!message.member.voice.channel) {
            message.channel.send(`${message.author} you must be in a voice channel to do this! `);
            return;
        }

        try {

            if(client.distube.getQueue(message).songs.length <= 1){
                message.channel.send("Mmm.. . soo bascilly. . ther e no morr songs to skip...")
                return
            }
            
            client.distube.skip(message);
            message.channel.send("Song skipped!");
        } catch (e) {
            console.error(e.name, e.message)
        }
    }
}

let auth = require('./auth.json');

client.on("ready", () => {
    console.log(`bot is online as ${client.user.tag}!`)

    client.user.setActivity(`busy being Smilbot!!`)
})

client.on("messageCreate", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)

    const command = args.shift().toLowerCase()
    
    commands.hasOwnProperty(command)&&commands[command](message, args)
    
})
client.login(auth.token)


client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send(`Now playing: \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`)
    )
    .on("empty", queue => queue.textChannel.send("Channel is empty. Leaving the channel"))
    .on("finish", queue => queue.textChannel.send("No more song in queue"))
    .on("addSong", (queue, song) => queue.textChannel.send(`Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}.`))

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