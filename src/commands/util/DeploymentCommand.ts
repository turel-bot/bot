/* eslint-disable indent */
import type TClient from '../../structures/TClient';
import type Command from '../../structures/Command';
import type { ChatInputCommandInteraction } from 'discord.js';
import deployCommands from '../../utility/DeployCommands';
import { CustomError } from '@biased-ts/eor';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';

const DeploymentCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('guild')
                .setDescription('Deploy commands locally to this guild')
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('clear')
                .setDescription('Clears all commands deployed in this guild.')
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName('global')
                .setDescription('Deploy commands globally.')
        )
        .setDescription('Redeploy slash commands through a command!'),

    async execute(interaction: ChatInputCommandInteraction) {
        if(!(interaction.client as TClient).isOwner(interaction.user.id)) {
            await interaction.reply({
                embeds: [
                    {
                        title: ':x: Insufficent permissions.'
                    }
                ]
            });
            return;
        }

        const subcommand: string = interaction.options.getSubcommand();

        switch(subcommand.toLowerCase()) {
            case 'guild':
                {
                    const amount: number = await deployCommands(process.env.CLIENT_ID as string, interaction.client.token, (interaction.client as TClient).commands, interaction.guild?.id);
                    await interaction.reply(`Successfully reloaded ${amount} application (/) commands.`);
                    break;
                }
            case 'clear':
                {
                    await interaction.guild?.commands.set([]);
                    await interaction.reply('Cleared all slash commands in this guild!');
                    break;
                }
            case 'global':
                {
                    const amount: number = await deployCommands(process.env.CLIENT_ID as string, interaction.client.token, (interaction.client as TClient).commands);
                    await interaction.reply(`Successfully reloaded ${amount} application (/) commands.`);
                    break;
                }
            default: {
                CustomError.createAndThrow('IllegalArgument', 'Deployment type cannot be of type ' + subcommand + '.');
                break;
            }
        }
    }
} as const;

export default DeploymentCommand;