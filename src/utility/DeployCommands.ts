/* eslint-disable */
// @ts-nocheck
import type { Collection } from 'discord.js';
import { REST, Routes } from 'discord.js';
import type Command from '../structures/Command';

async function deployCommands(clientId: string, token: string, commands: Collection<string, Command>, guildId?: string): Promise<number>
{
    const rest: REST = new REST({ version: '10' }).setToken(token);
    const commandArrayJSON: any[] = [];

    commands.forEach((cmd) => commandArrayJSON.push(cmd.data.toJSON()));

    try 
    {
        if(!guildId)
        {
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: commandArrayJSON }
            );

            console.log(`Successfully reloaded ${ (data as any).length } application (/) commands. (GLOBAL)`);
            return (data as any).length;
        }

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commandArrayJSON }
        );

        console.log(`Successfully reloaded ${ (data as any).length } application (/) commands.`);
        return (data as any).length;
    }
    catch(err)
    {
        console.error(err);
    }

    return -1;
}

export default deployCommands;