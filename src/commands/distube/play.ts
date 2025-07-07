import { Command } from '@/types/Command';
import { createEmbedText } from '@/utils/embedCreator';
import { Client, GuildTextBasedChannel, Message } from 'discord.js';
import { canSendMessages } from '@/utils/typeGuards';

/**
 * Command to play a song
 */
export const play: Command = {
    name: 'play',
    description: 'Reproduce una canción de YouTube o Spotify',
    aliases: ['p'],
    async execute(message: Message, args: string[], client: Client) {
        const voiceChannel = message.member?.voice.channel;
          
        if (!canSendMessages(message.channel)) {
            return
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

        const query = args.join(" ");
        if (!query) {
            message.channel.send({
                embeds: [
                    createEmbedText(0xFF0000, "Please provide the name or URL of the song.")
                ]
            });
            
            message.delete();
            return;
        }

        try {
            const distube = client.distube;
      
            // Llama a la función play de DisTube
            await distube.play(voiceChannel, query, {
              member: message.member,
              textChannel: message.channel as GuildTextBasedChannel,
              message,
            });
      
            // Elimina el mensaje original para limpiar el canal
            message.delete();
          } catch (e: any) {
            console.error(e.name, e.message);
            message.channel.send({
                embeds: [
                    createEmbedText(0xFF0000, "Ocurrió un error al intentar reproducir la canción.")
                ]
            });
          }
    }
}