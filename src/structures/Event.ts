import type TClient from './TClient';
import type { ClientEvents } from 'discord.js';

interface Event<K extends keyof ClientEvents> {
    readonly name: K;
    execute(client: TClient, ...args: ClientEvents[K]): Promise<any>;
}

export default Event;