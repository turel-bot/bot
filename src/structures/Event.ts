/* eslint-disable */
import { CustomError } from '@biased-ts/eor';
import { ClientEvents } from 'discord.js';
import TClient from './TClient';

class Event
{
    public readonly name: keyof ClientEvents;
    public constructor(name: keyof ClientEvents)
    {
        this.name = name;
    }

    // @ts-expect-error
    public async execute(client: TClient, ...args: any[]): Promise<any>
    {
        CustomError.createAndThrow('NotImplemented', 'Function #execute was not implemented by a class which extends command.');
    }
}

export default Event;