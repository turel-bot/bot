/* eslint-disable */
import { CustomError } from '@biased-ts/eor';
import type { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

/**
 * @description Represents a DiscordJS <code>Command</code>.
 */
class Command
{
    public readonly data: SlashCommandBuilder;
    public constructor(data: SlashCommandBuilder)
    {
        this.data = data;
    }

    // @ts-expect-error
    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        CustomError.createAndThrow('NotImplemented', 'Function #execute was not implemented by a class which extends command.');
    }
}

export default Command;