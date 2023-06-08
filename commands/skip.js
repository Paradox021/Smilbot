import { createEmbedText } from "../utils/embedCreator.js";

export const skip = async (message, args, client) => {
    if (!message.member.voice.channel) {
        message.channel.send(createEmbedText(0xFF0000, `${message.author} you must be in a voice channel to do this! `));
        message.delete()
        return;
    }

    try {

        if(client.distube.getQueue(message).songs.length <= 1){
            message.channel.send(createEmbedText(0xFF0000, `${message.author} you must have at least 2 songs in the queue to do this! `))
            message.delete()
            return
        }
        
        await client.distube.skip(message);
        message.delete()
    } catch (e) {
        console.error(e.name, e.message)
    }
}