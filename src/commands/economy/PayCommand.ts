import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../structures/Command';
import { updateUser } from '../../utility/db/updateUser';
import findOrCreateUser from '../../utility/db/FindOrCreateUser';

class PayCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
                .setName('pay')
                .addUserOption(
                    input =>
                        input.setName('user')
                            .setDescription('The user to pay.')
                            .setRequired(true)
                )
                .addIntegerOption(
                    input =>
                        input.setName('amount')
                            .setDescription('The amount of bottlecaps to transfer.')
                            .setRequired(true)
                )
                .setDescription('Give another user bottlecaps')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        const transferUser = interaction.options.getUser('user', true);
        const amount = interaction.options.getInteger('amount', true);

        if(amount <= 0 || isNaN(amount))
        {
            await interaction.reply({
                embeds: [{
                    title: ':x: Cannot send somebody less than or equal to 0 bottlecaps.'
                }]
            });

            return;
        }

        const executorUser: { ok: boolean, user: { balance: bigint; }; } = await findOrCreateUser(interaction.user.id) as any;
        if(executorUser.user.balance < amount)
        {
            await interaction.reply({
                embeds: [{
                    title: ':x: You cannot afford to transfer that many bottlecaps.'
                }], ephemeral: true
            });

            return;
        }

        const recievingUser: { ok: boolean, user: { balance: bigint; }; } = await findOrCreateUser(transferUser.id) as any;

        await updateUser(transferUser.id, Number(recievingUser.user.balance) + amount);
        await updateUser(interaction.user.id, Number(executorUser.user.balance) - amount);

        await interaction.reply({
            embeds: [{
                title: 'Transfered ' + amount + ' bottlecaps to ' + transferUser.username
            }], ephemeral: true
        });
    }
}

export default new PayCommand();