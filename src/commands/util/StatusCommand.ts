import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../structures/Command';
import { prismaClient } from '../../index';


class StatusCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
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
                .setDescription('Change the status of the bot.')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        const message: string = interaction.options.getString('message', true);
        const type: number = interaction.options.getNumber('type', true);

        if(interaction.user.id !== '327639826075484162' && interaction.user.id !== '949101689393254401')
        {
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
                description: `New Status: ${ type } ${ message }`
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
}

export default new StatusCommand();