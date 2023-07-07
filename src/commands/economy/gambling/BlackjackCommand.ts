/* eslint-disable indent */
import type Command from '../../../structures/Command';
import type OKType from 'src/utility/OKType';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { User as DBUser } from '@prisma/client';
import blackjack from '@turel/discord-blackjack';
import findOrCreateUser from '../../../utility/db/FindOrCreateUser';
import ParseIntWithCommas from '../../../utility/numbers/ParseIntWithCommas';
import { SlashCommandBuilder } from 'discord.js';
import { updateUser } from '../../../utility/db/updateUser';

const BlackjackCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .addIntegerOption(
            input =>
                input.setName('amount')
                    .setDescription('The amount to gamble!')
        )
        .setDescription('Gamble!'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const game = await blackjack(interaction);
        const amount: number = ParseIntWithCommas(interaction.options.getInteger('amount', false)!) ?? 0;
        const fetchedUser: OKType<DBUser> = await findOrCreateUser(interaction.user.id) as any;

        switch(game.result) {
            case 'WIN': {
                if(amount > 0)
                    await updateUser(interaction.user.id, BigInt(fetchedUser.data.balance + BigInt(amount)) * BigInt(2));
                break;
            }

            case 'LOSE': {
                if(amount > 0)
                    await updateUser(interaction.user.id, (BigInt(fetchedUser.data.balance)) - BigInt(amount));
                break;
            }

            case 'BLACKJACK': {
                if(amount > 0)
                    await updateUser(interaction.user.id, BigInt(fetchedUser.data.balance + BigInt(amount)) * BigInt(2.5));
                break;
            }

            case 'TIE': {
                // no reward on tie, but you dont lose anything
                break;
            }

            case 'None': default: {
                break;
            }
        }
    },
} as const;

export default BlackjackCommand;