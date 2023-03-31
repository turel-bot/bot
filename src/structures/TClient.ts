import type { ClientOptions } from 'discord.js';
import { Client, Collection } from 'discord.js';
import { CustomError } from '@biased-ts/eor';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import type Command from './Command';
import type Event from './Event';

interface Directories
{
    commandPath: string;
    eventPath: string;
}

class TClient extends Client
{
    public commands: Collection<string, Command> = new Collection<string, Command>();
    public cooldowns: Collection<string, { time: number, command: string; }> = new Collection<string, { time: number, command: string; }>();
    public owners: string[] = process.env.owners?.split(',') ?? [];

    // The rule is being stupid here. It is readonly.
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    public constructor(opts: Readonly<ClientOptions>)
    {
        super(opts);
    }

    /**
     * @description Starts the bot.
     * @param {string} token - The token of the bot to login to. 
     * @returns {string} The token which you 
     * @throws
     */
    public async init(token?: string, directories?: Readonly<Directories>): Promise<string>
    {
        // If we cannot find a token / we don't pass one, try to find one from ENV.
        if(!token)
        {
            if(process.env.TOKEN === null)
            {
                CustomError.createAndThrow('IllegalArgument', 'No token was passed, and no token was found in the process#env.');
                return '';
            }

            token = process.env.TOKEN!;
        }

        if(!directories)
        {
            directories = {
                commandPath: join(__dirname, '..', 'commands'),
                eventPath: join(__dirname, '..', 'events')
            } as const;
        }


        await this.loadCommands(directories.commandPath);
        await this.loadEvents(directories.eventPath);

        await this.login(token);

        return token;
    }

    /**
     * @description Loads commands recuresively from a base directory.
     * @param {string} directory - The base directory to recursively go through and find commands in. 
     */
    private async loadCommands(directory: string): Promise<void>
    {
        const files: string[] = readdirSync(directory);

        for(let i: number = 0; i < files.length; i++)
        {
            const path: string = `${ directory }/${ files[i] }`;
            const file: string = files[i];

            if(file.endsWith('.js') || file.endsWith('.ts'))
            {
                const registeredCommand: Command = await (import(path) as any);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this.commands.set((registeredCommand as any).default.data.name, (registeredCommand as any).default);
                console.log(`✔ Loaded command ${ (registeredCommand as any).default.data.name }.`);
            }
            else if(lstatSync(path).isDirectory())
            {
                await this.loadCommands(path);
            }
        }
    }

    /**
     * @description Loads events recursively from a base directory.
     * @param {string} directory - The base directory to recursively go through and find events in.
     */
    private async loadEvents(directory: string): Promise<void>
    {
        const files: string[] = readdirSync(directory);

        for(let i: number = 0; i < files.length; i++)
        {
            const path: string = `${ directory }/${ files[i] }`;
            const file: string = files[i];

            if(file.endsWith('.js') || file.endsWith('.ts'))
            {
                let registeredEvent: Event = await (import(path) as any);
                registeredEvent = (registeredEvent as any).default;
                this.on(registeredEvent.name, async (...args: any[]) =>
                    await registeredEvent.execute(this, args)
                );

                console.log(`✔ Loaded event ${ registeredEvent.name }.`);
            }
            else if(lstatSync(path).isDirectory())
            {
                await this.loadEvents(path);
            }
        }
    }

    public isOwner(id: string): boolean
    {
        for(let i: number = 0; i < this.owners.length; i++)
            if(this.owners[i] === id)
                return true;

        return false;
    }
}

export default TClient;