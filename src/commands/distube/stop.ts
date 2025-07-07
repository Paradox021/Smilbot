import { Command } from '@/types/Command';
import { createEmbedText } from '@/utils/embedCreator';
import { Client, Message, GuildTextBasedChannel } from 'discord.js';
import { canSendMessages } from '@/utils/typeGuards';

/**
 * Command to stop the queue
 */
export const stop: Command = {
    name: 'stop',
    description: 'Detiene la reproducción de la cola',
    aliases: ['leave'],
    async execute(message: Message, args: string[], client: Client) {
        const voiceChannel = message.member?.voice.channel;
        
        if (!canSendMessages(message.channel)) {
            return;
        }

        if (!voiceChannel) {
            message.channel.send({
                embeds: [
                    createEmbedText(0xFF0000, `${message.author} you must be in a voice channel to do this!`)
                ]
            });
            message.delete();
            return;
        }

        try {
            const distube = client.distube;

            // Llama a la función stop de DisTube
            distube.stop(message);
            
            // Envía un mensaje confirmando que se ha detenido la cola
            message.channel.send({
                embeds: [
                    createEmbedText(0x00569D, "Stopped the queue!")
                ]
            });
            message.delete();
        } catch (e: any) {
            console.error(e.name, e.message);
            message.channel.send({
                embeds: [
                    createEmbedText(0xFF0000, "Ocurrió un error al intentar detener la reproducción.")
                ]
            });
        }
    }
};