import type { ChatInputCommandInteraction } from 'discord.js';
import { ButtonBuilder, ButtonStyle } from 'discord.js';
import { SlashCommandBuilder, ActionRowBuilder } from 'discord.js';
import type Command from '../structures/Command';

const HiCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('hi')
        .setDescription('hi'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
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
    },
} as const;

export default HiCommand;