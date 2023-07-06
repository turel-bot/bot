import type { ChatInputCommandInteraction } from 'discord.js';
import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommandBuilder, ActionRowBuilder } from 'discord.js';
import Command from '../structures/Command';

class HiCommand extends Command {
    public constructor() {
        super(
            new SlashCommandBuilder()
                .setName('hi')
                .setDescription('hi')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('turel')
                    .setEmoji('1054614148199235585')
                    .setLabel('turel')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
            );

        await interaction.reply({ content: 'hi', components: [row as any] });
    }
}

export default new HiCommand();