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

export const buyOffer = async (message, args) => {
    if(args.length != 1){
        message.reply(createEmbedText(0x00569D, 'Invalid arguments'))
        return
    }
    const offer = {
        discordId: message.author.id,
        serverId: message.guild.id,
        offerId: args[0],
    }
    const res = await marketService.buyOffer(offer);
    if(res.status != 200){
        const error = await res.json()
        message.reply(createEmbedText(0x00569D, error.error))
        return
    }
    message.reply(createEmbedText(0x00569D, 'Card bought'))
}

export const removeOffer = async (message, args) => {
    if(args.length != 1){
        message.reply(createEmbedText(0x00569D, 'Invalid arguments'))
        return
    }
    const offer = {
        discordId: message.author.id,
        serverId: message.guild.id,
        offerId: args[0],
    }
    const res = await marketService.removeOffer(offer);
    if(res.status != 200){
        const error = await res.json()
        message.reply(createEmbedText(0x00569D, error.error))
        return
    }
    message.reply(createEmbedText(0x00569D, 'Offer removed'))
}