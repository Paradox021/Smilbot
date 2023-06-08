import { createEmbedSongQueue } from "../utils/embedCreator.js"
export const queue = (message, args, client) => {
    const queue = client.distube.getQueue(message)
    if (!queue){
        message.channel.send(`There is nothing playing!`)
        message.delete()
        return
    }   
    const embed = createEmbedSongQueue(0x00569D, queue.songs)
    message.channel.send(embed)
    message.delete()
}