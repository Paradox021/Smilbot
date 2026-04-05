/**
 * Represents a event
 */
export interface Event {
  name: string;
  once?: boolean; // Para eventos que se ejecutan una sola vez
  execute: (...args: any[]) => void | Promise<void>;
}