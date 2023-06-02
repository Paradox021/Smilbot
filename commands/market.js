import * as marketService from '../services/marketService.js';
import { createOpenMarket } from '../utils/embedCreator.js';
export const getAllOffers = async (message) => {
    const embed = createOpenMarket();
    message.reply(embed);
}