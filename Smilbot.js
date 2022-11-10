
import { Client, GatewayIntentBits} from 'discord.js'
import fetch from "node-fetch"
import { SpotifyPlugin } from "@distube/spotify"
import { DisTube }  from 'distube'
import { ping } from './command/ping.js'

const prefix = '.'


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
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true
          })
      ]
},)


const roll = message => {
    message.channel.send(rollDice())
}
const quote = message => {
    inspirationalQuote().then(quote => message.channel.send(quote.text + " -"+(quote.author||"Anonymous")))
}
const cat = message => {
    getCat().then(imageUrl => message.channel.send({files:[imageUrl]}))
}
const play = async (message, args) =>{
    if (!message.member.voice.channel) {
        message.channel.send(`${message.author} you must be in a voice channel to do this! `);
        message.delete()
        return;
    }
    try {
        
        await client.distube.play(message.member.voice.channel, args.join(" "), {
            member: message.member,
            textChannel: message.channel,
            message
        })
        message.delete()

    } catch (e) {
        console.error(e.name, e.message)
    }
}
const stop = message => {
    if (!message.member.voice.channel) {
        message.channel.send(`${message.author} you must be in a voice channel to do this! `);
        message.delete()
        return;
    }
    try {
        client.distube.stop(message);
        message.channel.send("Stopped the queue!");
        message.delete()
    } catch (error) {
        console.error(e.name, e.message)
    }
}
const skip = async message => {
    if (!message.member.voice.channel) {
        message.channel.send(`${message.author} you must be in a voice channel to do this! `);
        message.delete()
        return;
    }

    try {

        if(client.distube.getQueue(message).songs.length <= 1){
            message.channel.send("Mmm.. . soo basicly. . ther e no morr songs to skip...")
            message.delete()
            return
        }
        
        await client.distube.skip(message);
        message.channel.send("Song skipped!");
        message.delete()
    } catch (e) {
        console.error(e.name, e.message)
    }
}

const queue = message => {
    const queue = client.distube.getQueue(message)
    if (!queue){
        message.channel.send(`There is nothing playing!`)
        message.delete()
        return
    }   
    const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Playing:' : i+"."} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
    message.channel.send(`**Server Queue**\n${q}`)
    message.delete()
}

const commands = {
    'ping': ping,
    'welcome': validateWelcome,
    'roll': roll,
    'quote': quote,
    'cat': cat,
    'play': play,
    'p': play,
    'stop': stop,
    'leave': stop,
    'skip': skip,
    'queue': queue,
    'q': queue 
}


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


client.login(process.env.token);

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