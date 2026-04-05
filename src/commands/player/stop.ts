import { Command } from '@/types/Command';
import { createTextEmbed } from '@/components/embeds';
import { Client, Message, GuildTextBasedChannel } from 'discord.js';
import { canSendMessages } from '@/utils/typeGuards';

/**
 * Command to stop the queue
 */
export const stop: Command = {
    name: 'stop',
    description: 'Stops the current queue playback',
    aliases: ['leave'],
    async execute(message: Message, args: string[], client: Client) {
        const voiceChannel = message.member?.voice.channel;
        
        if (!canSendMessages(message.channel)) {
            return;
        }

        if (!voiceChannel) {
            message.channel.send({
                embeds: [
                    createTextEmbed(0xFF0000, `${message.author} you must be in a voice channel to do this!`)
                ]
            });
            message.delete();
            return;
        }

        try {
            const queue = client.player.nodes.get(message.guildId!);

            if (queue) {
                // Elimina la cola y desconecta el bot (cumpliendo tu requerimiento)
                queue.delete();
            }
            
            // Envía un mensaje confirmando que se ha detenido la cola
            message.channel.send({
                embeds: [
                    createTextEmbed(0x00569D, "Stopped the queue and left the channel!")
                ]
            });
            message.delete();
        } catch (e: any) {
            console.error(e.name, e.message);
            message.channel.send({
                embeds: [
                    createTextEmbed(0xFF0000, "An error occurred while trying to stop playback.")
                ]
            });
        }
    }
};