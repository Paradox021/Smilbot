import { Command } from '@/types/Command';
import { Message, Client } from 'discord.js';

/**
 * Daily Balance command to get the daily 100 coins
 */
export const dailyBalance: Command = {
    name: 'dailybalance',
    aliases: ['db'],
    description: 'Reclama tu saldo diario de 100 monedas',
    middlewares: [],
    execute: async (message: Message, args: string[], client: Client) => {

        const discordId = message.author.id;

        // const res = await claimDailyBalance(discordId);

        // if (!res.ok) {
        // const { error } = await res.json();
        // const errorEmbed = createEmbedText(0xFF0000, error);
        // return message.reply({ embeds: [errorEmbed] });
        // }

        // const newUser = await res.json();
        // const successEmbed = createEmbedText(
        // 0x00569D,
        // `Has reclamado tu saldo diario!\nTu nuevo balance es: ${newUser.balance} monedas.`
        // );

        // await message.reply({ embeds: [successEmbed] });
  }
  
};