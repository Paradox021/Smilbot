import { ActivityType, Client } from "discord.js";
import { Event } from '@/types/Event';

/**
 * Set the bot's activity and log that the bot is online
 */
export const ready: Event = {
    name: 'clientReady',
    once: true,
    execute: (client: Client) => {
        console.log(`Bot is online as ${client.user?.tag}!`);
        client.user?.setActivity('😎 Busy being Smilbot!!', { type: ActivityType.Custom });
    },
};