import type { Message } from 'discord.js';
import { ChannelType } from 'discord.js';
import type TClient from '../structures/TClient';
import Event from '../structures/Event';

class messageCreate extends Event
{
    constructor()
    {
        super('messageCreate');
    }

    public async execute(client: TClient, message: Message): Promise<void>
    {
        // #region preconditions
        if(message.author.bot) return; // skip if its a bot, we dont care.
        if(message.channel === null) return; // if there isnt a channel, we dont care.
        if(message.channel.type === ChannelType.DM) return; // if its DMed to the bot, we dont care.
        if(message.guild === null) return; // if there isnt a guild involved w the message, we dont care.
        // #endregion

        // IMPL
    }
}

export default new messageCreate();