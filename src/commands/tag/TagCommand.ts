import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../structures/Command';

class TagCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
                .setName('tag')
                .setDescription('Allows creating per guild tags, that store custom text.')
                .addSubcommand((sub) =>
                    sub.setName('create')
                        .setDescription('Creates a new tag in this guild.')
                        .addStringOption((str) =>
                            str.setName('Name')
                                .setDescription('The name of the tag to create.')
                        )
                        .addStringOption((str) =>
                            str.setName('Content')
                                .setDescription('The content of the tag.'))
                )
                .addSubcommand((sub) =>
                    sub.setName('get')
                        .setDescription('Get a specific tag in this guild.')
                        .addStringOption((str) =>
                            str.setName('Name')
                                .setDescription('The name of the tag to get.')))
                .addSubcommand((sub) =>
                    sub.setName('delete')
                        .addStringOption((str) =>
                            str.setName('name')
                                .setDescription('The name of the tag to delete.'))) as SlashCommandBuilder
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        const subcommand: 'delete' | 'get' | 'create' = interaction.options.getSubcommand() as any;

        switch(subcommand.toLowerCase())
        {
        case 'delete': {
            await this.deleteTag(interaction);
            break;
        }
        case 'get': {
            await this.getTag(interaction);
            break;
        }
        case 'create': {
            await this.createTag(interaction);
            break;
        }
        default: {
            await interaction.reply('Failed to get subcommand type, weird.');
            console.error('Failed to get subcommand group for a tag, weird.');
        }
        }
    }

    public async deleteTag(interaction: ChatInputCommandInteraction): Promise<any>
    {

    }

    public async getTag(interaction: ChatInputCommandInteraction): Promise<any>
    {

    }

    public async createTag(interaction: ChatInputCommandInteraction): Promise<any>
    {

    }
}

export default new TagCommand();