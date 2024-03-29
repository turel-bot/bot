import type { ClientOptions } from 'discord.js';
import { Client, Collection } from 'discord.js';
import { CustomError } from '@biased-ts/eor';
import { lstatSync, readdirSync } from 'fs';
import { join } from 'path';
import type Command from './Command';
import type Event from './Event';
import chalk from 'chalk';

interface Directories {
    commandPath: string;
    eventPath: string;
}

class TClient extends Client {
    public commands: Collection<string, Command> = new Collection<string, Command>();
    public cooldowns: Collection<string, { time: number, command: string; }> = new Collection<string, { time: number, command: string; }>();
    public owners: string[] = process.env.OWNERS?.split(',') ?? [];

    // The rule is being stupid here. It is readonly.
    public constructor(opts: Readonly<ClientOptions>) {
        super(opts);
    }

    /**
     * @description Starts the bot.
     * @param {string} token - The token of the bot to login to. 
     * @returns {string} The token which you 
     * @throws
     */
    public async init(token?: string, directories?: Readonly<Directories>): Promise<string> {
        // If we cannot find a token / we don't pass one, try to find one from ENV.
        if(!token) {
            if(process.env.TOKEN === null) {
                CustomError.createAndThrow('IllegalArgument', 'No token was passed, and no token was found in the process#env.');
                return '';
            }

            token = process.env.TOKEN!;
        }

        if(!directories) {
            directories = {
                commandPath: join(__dirname, '..', 'commands'),
                eventPath: join(__dirname, '..', 'events')
            } as const;
        }


        await this.loadCommands(directories.commandPath);
        await this.loadEvents(directories.eventPath);

        // djs does some weird token censorship here so you can
        // log it, but the funtion for that is private so we just
        // store what we get and echo it back to mimick djs's
        // original login function
        const censored_token: string = await this.login(token);

        return censored_token;
    }

    /**
     * @description Loads commands recuresively from a base directory.
     * @param {string} directory - The base directory to recursively go through and find commands in. 
     */
    private async loadCommands(directory: string): Promise<void> {
        const files: string[] = readdirSync(directory);

        for(let i: number = 0; i < files.length; i++) {
            const path: string = `${directory}/${files[i]}`;
            const file: string = files[i];

            if(file.endsWith('.js') || file.endsWith('.ts')) {
                const registeredCommand: { default: Command; } = await (import(path) as any);
                this.commands.set(registeredCommand.default.data.name, registeredCommand.default);
                console.log(`${chalk.green('✔')} Loaded command ${registeredCommand.default.data.name}.`);
            }
            else if(lstatSync(path).isDirectory()) {
                await this.loadCommands(path);
            }
        }
    }

    /**
     * @description Loads events recursively from a base directory.
     * @param {string} directory - The base directory to recursively go through and find events in.
     */
    private async loadEvents(directory: string): Promise<void> {
        const files: string[] = readdirSync(directory);

        for(let i: number = 0; i < files.length; i++) {
            const path: string = `${directory}/${files[i]}`;
            const file: string = files[i];

            if(file.endsWith('.js') || file.endsWith('.ts')) {
                const registeredEvent: { default: Event<any>; } =
                    await (import(path) as Promise<{ default: Event<any>; }>);
                this.on(registeredEvent.default.name, async (...args: any[]) =>
                    await registeredEvent.default.execute(this, args)
                );

                console.log(`${chalk.green('✔')} Loaded event ${registeredEvent.default.name}.`);
            }
            else if(lstatSync(path).isDirectory()) {
                await this.loadEvents(path);
            }
        }
    }

    public isOwner(id: string): boolean {
        for(let i: number = 0; i < this.owners.length; i++)
            if(this.owners[i] === id)
                return true;

        return false;
    }
}

export default TClient;