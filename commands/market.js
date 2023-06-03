import * as marketService from '../services/marketService.js';
import { createEmbedText, createOpenMarket } from '../utils/embedCreator.js';

export const getAllOffers = async (message) => {
    const embed = createOpenMarket();
    message.reply(embed);
}

export const addOffer = async (message, args) => {
    if(args.length != 2){
        message.reply(createEmbedText(0x00569D, 'Invalid arguments'))
        return
    }
    const offer = {
        discordId: message.author.id,
        serverId: message.guild.id,
        cardName: args[0],
        price: args[1],
    }
    const res = await marketService.addOffer(offer);
    if(res.status != 200){
        message.reply(createEmbedText(0x00569D, res.statusText))
        return
    }
    message.reply(createEmbedText(0x00569D, 'Offer added to the market'))
}