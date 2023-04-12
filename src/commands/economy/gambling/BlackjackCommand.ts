/* eslint-disable indent */
import type { ChatInputCommandInteraction } from 'discord.js';
import type { User as DBUser } from '@prisma/client';
import type OKType from 'src/utility/OKType';
import { updateUser, findOrCreateUser } from '../../../utility/db';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../../structures/Command';
import blackjack from '@turel/discord-blackjack';
import ParseIntWithCommas from '../../../utility/numbers/ParseIntWithCommas';

class CoinflipCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
                .setName('blackjack')
                .addIntegerOption(
                    input =>
                        input.setName('amount')
                            .setDescription('The amount to gamble!')
                )
                .setDescription('Gamble!')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        const game = await blackjack(interaction);
        const amount: number = ParseIntWithCommas(interaction.options.getInteger('amount', false)!) ?? 0;
        const fetchedUser: OKType<DBUser> = await findOrCreateUser(interaction.user.id) as any;

        switch(game.result)
        {
            case 'WIN': {
                if(amount > 0)
                    await updateUser(interaction.user.id, BigInt(fetchedUser.data!.balance + BigInt(amount)) * BigInt(2));
                break;
            }

            case 'LOSE': {
                if(amount > 0)
                    await updateUser(interaction.user.id, (BigInt(fetchedUser.data!.balance)) - BigInt(amount));
                break;
            }

            default: {
                break;
            }
        }
    }
}

export default new CoinflipCommand();