import { createEmbedText } from "../utils/embedCreator.js";
export const play = async (message, args, client) =>{
    if (!message.member.voice.channel) {
        message.channel.send(createEmbedText(0xFF0000, `${message.author} you must be in a voice channel to do this! `));
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