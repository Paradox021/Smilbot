
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
import { dailyBalance } from './commands/dailyBalance.js'
import { getCard , createCard, myCards } from './commands/card.js'
import { balance } from './commands/balance.js'
import { createEmbedSong } from './utils/embedCreator.js'
import { getAllOffers, addOffer } from './commands/market.js'
import * as dotenv from 'dotenv'
import { buttons } from './utils/buttons.js'

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
    .on("empty", queue => queue.textChannel.send("Channel is empty. Leaving the channel"))
    .on("finish", queue => queue.textChannel.send("No more song in queue"))
    .on("addSong", (queue, song) => queue.textChannel.send(createEmbedSong(0x85C734, 'Song added', song)))

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    buttons.hasOwnProperty(interaction.customId) && buttons[interaction.customId](interaction)
})

client.login(process.env.TOKEN);
