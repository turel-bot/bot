import type { ChatInputCommandInteraction } from 'discord.js';
import type Command from '../../structures/Command';
import type TClient from 'src/structures/TClient';
import { SlashCommandBuilder } from 'discord.js';
import { prismaClient } from '../../index';


const StatusCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('status')
        .addStringOption(opt =>
            opt.setName('message')
                .setDescription('What to set the status message to.')
                .setRequired(true)
        )
        .addNumberOption(opt =>
            opt.setName('type')
                .setDescription('What type of status is it?')
                .addChoices(
                    { name: 'Playing', value: 0 },
                    { name: 'Streaming', value: 1 },
                    { name: 'Listening', value: 2 },
                    { name: 'Watching', value: 3 },
                    { name: 'Competing', value: 5 },
                )
        )
        .setDescription('Change the status of the bot.'),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const message: string = interaction.options.getString('message', true);
        const type: number = interaction.options.getNumber('type', true);

        if((interaction.client as TClient).isOwner(interaction.user.id)) {
            await interaction.reply({
                embeds: [
                    {
                        title: ':x: Insufficent permissions.'
                    }
                ]
            });
            return;
        }

        // I love the type system! The type system is so fun!
        interaction.client.user.setActivity(message, { type: type });
        await interaction.reply({
            embeds: [{
                title: 'Status Updated!',
                description: `New Status: ${type} ${message}`
            }]
        });

        await prismaClient.status.update({
            data: {
                shard: 0,
                text: message,
                type: type,
                url: 'https://twitch.tv/turelbot'
            },
            where: {
                shard: 0
            }
        });

    }
} as const;

export default StatusCommand;