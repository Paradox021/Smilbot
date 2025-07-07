// src/utils/typeGuards.ts

/**
 * Check if the channel is a text channel
 * @param channel The channel to check
 * @returns If the channel is a text channel
 */
export function canSendMessages(channel: any): channel is { send: (...args: any[]) => any } {
    return typeof channel.send === 'function';
}