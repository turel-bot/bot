import type { ChatInputCommandInteraction } from 'discord.js';
import { ActivityType } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../structures/Command';

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
                .addStringOption(opt =>
                    opt.setName('type')
                        .setDescription('What type of status is it?')
                        .addChoices(
                            { name: 'Playing', value: 'Playing' },
                            { name: 'Streaming', value: 'Streaming' },
                            { name: 'Listening', value: 'Listening' },
                            { name: 'Watching', value: 'Watching' },
                            { name: 'Competing', value: 'Competing' },
                        )
                )
                .setDescription('Change the status of the bot.')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        const message: string = interaction.options.getString('message', true);
        const type: string = interaction.options.getString('type', true);

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
        interaction.client.user.setActivity(message, { type: ActivityType[type as any] as any });
        await interaction.reply({
            embeds: [{
                title: 'Status Updated!',
                description: `New Status: ${ type } ${ message }`
            }]
        });
    }
}

export default new StatusCommand();