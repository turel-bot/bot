import type { Interaction } from 'discord.js';
import handleCommand from '../handlers/CommandHandler';
import type TClient from '../structures/TClient';
import Event from '../structures/Event';

class interactionCreate extends Event
{
    constructor()
    {
        super('interactionCreate');
    }

    public async execute(client: TClient, interaction: Interaction): Promise<void>
    {
        if(interaction.isChatInputCommand())
            await handleCommand(client, interaction);
    }
}

export default new interactionCreate();