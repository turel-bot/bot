import type { Message } from 'discord.js';
import { ChannelType } from 'discord.js';
import { addXPGain } from '../utility/levels';
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

        /**
         * HOW LEVELING ON MESSAGES SHOULD WORK:
         * every time they level up assign them a new number of messages they have to send before they can get xp again
         * defaults to 1
         */

        if(!message.author.untilNextXP || typeof message.author.untilNextXP === 'undefined')
            message.author.untilNextXP = 0;

        if(message.author.untilNextXP === 0)
        {
            await addXPGain(message.author);
            message.author.untilNextXP = Math.floor(Math.random() * 25); // random number between 1 & 25
            return;
        }

        message.author.untilNextXP = message.author.untilNextXP--;
    }
}

export default new messageCreate();