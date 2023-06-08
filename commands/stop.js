import { createEmbedText } from "../utils/embedCreator.js";

export const stop = (message, args, client) => {
    if (!message.member.voice.channel) {
        // manda un embed con color rojo y el mensaje de que no estas en un canal de voz
        const embed = createEmbedText(0xFF0000, `${message.author} you must be in a voice channel to do this! `);
        message.channel.send(embed);
        message.delete()
        return;
    }
    try {
        client.distube.stop(message);
        const embed = createEmbedText(0x00569D, "Stopped the queue!");
        message.channel.send(embed);
        message.delete()
    } catch (e) {
        console.error(e.name, e.message)
    }
}