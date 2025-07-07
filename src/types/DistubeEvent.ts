import { DisTubeEvents } from "distube";

/**
 * Represents a DisTube event
 */
export interface DistubeEvent {
    name: keyof DisTubeEvents;
    execute: (...args: any[]) => Promise<void> | void;
}