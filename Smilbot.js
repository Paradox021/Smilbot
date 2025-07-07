
import { Client, GatewayIntentBits} from 'discord.js'
import { SpotifyPlugin } from "@distube/spotify"
import { DisTube }  from 'distube'
import { ping } from './commands/ping.js'
import { roll } from './commands/roll.js'
import { quote } from './commands/quote.js'
import { cat } from './commands/cat.js'
import { play } from './commands/play.js'
import { stop } from './commands/stop.js'
import { skip } from './commands/skip.js'
import { queue } from './commands/queue.js'
import { help } from './commands/help.js'
import { dailyBalance } from './commands/dailyBalance.js'
import { getCard , createCard, myCards, otherCards, getAllCards } from './commands/card.js'
import { balance } from './commands/balance.js'
import { createEmbedSong, createEmbedText } from './utils/embedCreator.js'
import { getAllOffers, addOffer, buyOffer, removeOffer } from './commands/market.js'
import * as dotenv from 'dotenv'
import { handleButtons } from './utils/buttons.js'
import { YouTubePlugin } from '@distube/youtube'
import fs from 'fs'

dotenv.config()
const prefix = '.'
const commands = {
    'ping': ping,
    'roll': roll,
    'quote': quote,
    'cat': cat,
    'play': play,
    'p': play,
    'stop': stop,
    'leave': stop,
    'skip': skip,
    'queue': queue,
    'q': queue,
    'getcard': getCard,
    'createcard': createCard,
    'dailybalance': dailyBalance,
    'balance': balance,
    'mycards': myCards,
    'market': getAllOffers,
    'sell': addOffer,
    'buy': buyOffer,
    'remove': removeOffer,
    'show': otherCards,
    'cards': getAllCards,
    'help': help
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
})
client.distube = new DisTube(client, {
    // leaveOnEmpty: true,
    // leaveOnStop: true,
    emitNewSongOnly: true,
    // leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
          }),
        new YouTubePlugin({
            cookies: JSON.parse(fs.readFileSync('./cookies.json', 'utf8'))
        }),
      ]
},)

client.on("ready", () => {
    console.log(`bot is online as ${client.user.tag}!`)
    client.user.setActivity(`busy being Smilbot!!`)
})

client.on("messageCreate", (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)

    const command = args.shift().toLowerCase()
    
    commands.hasOwnProperty(command)&&commands[command](message, args, client)
    
})

client.distube
    .on('playSong', (queue, song) => queue.textChannel.send(createEmbedSong(0x00569D, 'Now playing', song)))
    .on("empty", queue => {
        queue.textChannel.send(createEmbedText(0x85C734, 'Channel is empty, leaving the channel'));
      })
      .on("finish", queue => {
        queue.textChannel.send(createEmbedText(0x85C734, 'No more songs in queue, leaving the channel'));
      })
      .on("addSong", (queue, song) => {
        queue.textChannel.send(createEmbedSong(0x85C734, 'Song added', song));
      })
      .on("deleteQueue", queue => {
        queue.voice.leave()
      })
      .on("ffmpegDebug", console.log)
      .on('error', (error, queue) => {
        console.log('DisTube error:', error)
      });

client.on('interactionCreate', async (interaction) => {
    handleButtons(interaction)
})

client.login(process.env.TOKEN);
