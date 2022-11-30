
import { Client, GatewayIntentBits, EmbedBuilder} from 'discord.js'
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

client.distube.on('playSong', (queue, song) =>{
    const exampleEmbed = new EmbedBuilder()
            .setColor(0x00569D)
	        .setTitle('Now playing')
	        .setDescription(`${song.name} - \`${song.formattedDuration}\``)
	        .setThumbnail(song.thumbnail)
	        .setTimestamp()
            .setFooter({ text: `Requested by ${song.user.tag}`, iconURL: song.user.avatarURL() });
    queue.textChannel.send({ embeds: [exampleEmbed] });

    })
    .on("empty", queue => queue.textChannel.send("Channel is empty. Leaving the channel"))
    .on("finish", queue => queue.textChannel.send("No more song in queue"))
    .on("addSong", (queue, song) => {
        const exampleEmbed = new EmbedBuilder()
            .setColor(0x85C734)
	        .setTitle('Song added')
	        .setDescription(`${song.name} - \`${song.formattedDuration}\``)
	        .setThumbnail(song.thumbnail)
	        .setTimestamp()
            .setFooter({ text: `Added by ${song.user.tag}`, iconURL: song.user.avatarURL() });
        queue.textChannel.send({ embeds: [exampleEmbed] });
    })
            
client.login(process.env.token);