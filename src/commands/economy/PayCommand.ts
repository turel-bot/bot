import type { ChatInputCommandInteraction } from 'discord.js';
import type { User as DBUser } from '@prisma/client';
import type OKType from '../../utility/OKType';
import type Command from '../../structures/Command';
import findOrCreateUser from '../../utility/db/FindOrCreateUser';
import ParseIntWithCommas from '../../utility/numbers/ParseIntWithCommas';
import { SlashCommandBuilder } from 'discord.js';
import { updateUser } from '../../utility/db/updateUser';

const PayCommand: Command = {
    data: new SlashCommandBuilder()
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
        .setDescription('Give another user bottlecaps'),

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const transferUser = interaction.options.getUser('user', true);
        const amount = ParseIntWithCommas(interaction.options.getInteger('amount', true));

        if(amount === null) {
            await interaction.reply({
                embeds: [{
                    title: 'Expected a number value to be passed to \`amount\`.'
                }],
                ephemeral: true
            });

            return;
        }

        if(amount <= 0 || isNaN(amount)) {
            await interaction.reply({
                embeds: [{
                    title: ':x: Cannot send somebody less than or equal to 0 bottlecaps.'
                }]
            });

            return;
        }

        const executorUser: OKType<DBUser> = await findOrCreateUser(interaction.user.id);
        if(executorUser.data.balance < amount) {
            await interaction.reply({
                embeds: [{
                    title: ':x: You cannot afford to transfer that many bottlecaps.'
                }], ephemeral: true
            });

            return;
        }

        const recievingUser: OKType<DBUser> = await findOrCreateUser(transferUser.id);

        await updateUser(transferUser.id, BigInt((recievingUser.data.balance + BigInt(amount))));
        await updateUser(interaction.user.id, BigInt((executorUser.data.balance - BigInt(amount))));

        await interaction.reply({
            embeds: [{
                title: 'Transfered ' + amount + ' bottlecaps to ' + transferUser.username
            }], ephemeral: true
        });
    },
} as const;

export default PayCommand;