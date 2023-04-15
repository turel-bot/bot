import type { Interaction } from 'discord.js';
import type TClient from '../structures/TClient';
import Event from '../structures/Event';
import type Command from '../structures/Command';

class interactionCreate extends Event
{
    constructor()
    {
        super('interactionCreate');
    }

    public async execute(client: TClient, interaction: Interaction): Promise<void>
    {
        interaction = (interaction as any)[0];
        
        if(interaction.isChatInputCommand())
        {
            const command: Command | undefined = client.commands.get(interaction.commandName);

            if(!command)
                return;

            try
            {
                client.emit('debug', `Executed command ${command.data.name}`);
                await command.execute(interaction);
            }
            catch(error: any)
            {
                console.error(error);
                await interaction.channel?.send(`An unexcepted error has occured while trying to execute that command.`);
            }
        }
    }
}

export default new interactionCreate();