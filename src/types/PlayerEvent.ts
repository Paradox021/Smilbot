import { GuildQueueEvent } from 'discord-player';

/**
 * Represents a discord-player event
 */
export interface PlayerEvent {
    name: string;
    execute: (...args: any[]) => Promise<void> | void;
}
