import type { ChatInputCommandInteraction } from 'discord.js';
import type Command from '../structures/Command';
import type TClient from '../structures/TClient';

export default async function handleCommand(client: TClient, interaction: ChatInputCommandInteraction): Promise<void>
{
    const command: Command | undefined = client.commands.get(interaction.commandName);

    if(!command) 
        return;

    try
    {
        await command.execute(interaction);
    }
    catch(error: any)
    {
        console.error(error);
        await interaction.channel?.send(`An unexcepted error has occured while trying to execute that command.`);
    }
}