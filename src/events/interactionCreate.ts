import type { ChatInputCommandInteraction, Interaction } from 'discord.js';
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
        interaction = (interaction as any)[0];
        
        await handleCommand(client, interaction as ChatInputCommandInteraction);
    }
}

export default new interactionCreate();