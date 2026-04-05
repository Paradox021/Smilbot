import { ready } from './ready';
import { messageCreate } from './messageCreate';
import { interactionCreate } from './interactionCreate';

/**
 * List of client events
 */
export const clientEvents = [
    ready, 
    messageCreate, 
    interactionCreate
];