import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../structures/Command';

class ExampleCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
                .setName('example')
                .setDescription('example command')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        await interaction.reply('hi');
    }
}

export default new ExampleCommand();