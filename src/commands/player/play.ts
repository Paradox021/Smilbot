import { Command } from '@/types/Command';
import { createTextEmbed } from '@/components/embeds';
import { Client, GuildTextBasedChannel, Message } from 'discord.js';
import { canSendMessages } from '@/utils/typeGuards';

/**
 * Command to play a song
 */
export const play: Command = {
    name: 'play',
    description: 'Plays a song from YouTube or Spotify',
    aliases: ['p'],
    async execute(message: Message, args: string[], client: Client) {
        const voiceChannel = message.member?.voice.channel;
          
        if (!canSendMessages(message.channel)) {
            return
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

        const query = args.join(" ");
        if (!query) {
            message.channel.send({
                embeds: [
                    createTextEmbed(0xFF0000, "Please provide the name or URL of the song.")
                ]
            });
            
            message.delete();
            return;
        }

        try {
            const player = client.player;
            
            // Llama a la función play de discord-player
            await player.play(voiceChannel, query, {
                nodeOptions: {
                    metadata: {
                        channel: message.channel
                    }
                }
            });
      
            // Elimina el mensaje original para limpiar el canal
            message.delete();
          } catch (e: any) {
            console.error(e.name, e.message);
            message.channel.send({
                embeds: [
                    createTextEmbed(0xFF0000, "An error occurred while trying to play the song.")
                ]
            });
          }
    }
}