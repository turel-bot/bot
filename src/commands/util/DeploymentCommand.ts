/* eslint-disable indent */
/* eslint-disable default-case */
import { CustomError } from '@biased-ts/eor';
import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import deployCommands from '../../utility/DeployCommands';
import type TClient from '../../structures/TClient';
import Command from '../../structures/Command';

class DeploymentCommand extends Command {
    public constructor() {
        super(
            new SlashCommandBuilder()
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
                .setDescription('Redeploy slash commands through a command!')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        if(interaction.user.id !== '327639826075484162' && interaction.user.id !== '949101689393254401') {
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
                    await interaction.reply(`Successfully reloaded ${ amount } application (/) commands.`);
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
                    await interaction.reply(`Successfully reloaded ${ amount } application (/) commands.`);
                    break;
                }
            default: {
                CustomError.createAndThrow('IllegalArgument', 'Deployment type cannot be of type ' + subcommand + '.');
                break;
            }
        }
    }
}

export default new DeploymentCommand();