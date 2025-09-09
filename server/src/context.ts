import { EventEmitter } from "events";

export const eventEmitter = new EventEmitter();

export function createContext() {
  return {
    events: eventEmitter,
  };
}

export type Context = ReturnType<typeof createContext>;