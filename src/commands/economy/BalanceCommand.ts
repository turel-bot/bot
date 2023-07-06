import type TClient from 'src/structures/TClient';
import type OKType from '../../utility/OKType';
import type { ChatInputCommandInteraction, User } from 'discord.js';
import type { User as DBUser } from '@prisma/client';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../structures/Command';
import findOrCreateUser from '../../utility/db/FindOrCreateUser';
import { updateUser } from '../../utility/db/updateUser';
import ParseIntWithCommas from '../../utility/numbers/ParseIntWithCommas';

class BalanceCommand extends Command {
    public constructor() {
        super(
            new SlashCommandBuilder()
                .setName('balance')
                .addUserOption(
                    input =>
                        input.setName('user')
                            .setDescription('See another users balance.'))
                .addIntegerOption(
                    input =>
                        input.setName('amount')
                            .setDescription('The amount to set the balance to')
                )
                .setDescription('View your or anothers balance.')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any> {
        const iUser = interaction.options.getUser('user', false) ?? interaction.user;
        const amount = ParseIntWithCommas(interaction.options.getInteger('amount', false)!);

        const query: OKType<DBUser> = await findOrCreateUser(iUser.id);

        if(!query.ok) {
            await interaction.reply({ content: 'Failed to fetch your details. Try again later.', ephemeral: true });
            return;
        }

        if(amount !== null && amount >= 0) {
            await this.updateBalance(interaction, iUser, query);
            return;
        }

        await this.sendBalance(interaction, iUser, query);
    }

    public async updateBalance(interaction: ChatInputCommandInteraction, iUser: User, query: OKType<DBUser>) {
        if(query === null) {
            await interaction.reply({ content: 'Failed to fetch your details. Try again later.', ephemeral: true });
            return;
        }

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

        const amount = interaction.options.getInteger('amount', true);
        const newUser = await updateUser(iUser.id, BigInt(amount));

        await interaction.reply({ content: `Set ${ iUser.username }'s balance to ${ newUser.balance.toLocaleString() }.` });
    }

    public async sendBalance(interaction: ChatInputCommandInteraction, iUser: User, query: OKType<DBUser>) {
        if(query === null) {
            await interaction.reply({ content: 'Failed to fetch your details. Try again later.', ephemeral: true });
            return;
        }

        const user: { id: string, balance: bigint; } = query.data as any;
        await interaction.reply({ content: `${ interaction.user === iUser ? 'You have' : `${ iUser.username } has` } ${ user.balance.toLocaleString() } bottlecaps.`, ephemeral: true });
    }
}

export default new BalanceCommand();