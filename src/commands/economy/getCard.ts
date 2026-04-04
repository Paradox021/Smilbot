import { Command } from '@/types/Command';
import { createEmbedText, createEmbedCard } from '@/utils/embedCreator';
import { Colors, Message, Client } from 'discord.js';
import { cardService } from '@/services/cardService';
import { checkUser } from '@/middlewares/checkUser';

export const getCard: Command = {
    name: 'getcard',
    aliases: ['buycard', 'gc'],
    description: 'Compra una carta aleatoria por 100 monedas',
    middlewares: [checkUser],
    execute: async (message: Message, args: string[], client: Client) => {
        const discordId = message.author.id;

        try {
            // Backend handles balance check and deduction
            const card = await cardService.buyRandomCard(discordId);

            message.reply({
                embeds: [createEmbedCard(card)]
            });

        } catch (error: any) {

            // Handle specific errors from backend if possible, e.g., insufficient funds
            const errorMessage = error.response?.data?.error || error.message || "Ocurrió un error inesperado.";
            message.reply({
                embeds: [createEmbedText(Colors.Red, errorMessage)]
            });
        }
    }
};
