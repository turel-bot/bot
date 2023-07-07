/* eslint-disable */
import type { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

/**
 * @description Represents a DiscordJS <code>Command</code>.
 */
interface Command {
    readonly data: SlashCommandBuilder;
    execute(interaction: ChatInputCommandInteraction): Promise<any>
}

export default Command;