/* eslint-disable indent */
import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../../structures/Command';
import findOrCreateUser from '../../../utility/db/FindOrCreateUser';
import { updateUser } from '../../../utility/db/updateUser';
import blackjack from '../../../discord-blackjack/index';

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
        const amount: number = interaction.options.getInteger('amount', false) ?? 0;
        const fetchedUser: { ok: boolean, user: { balance: bigint; }; } = await findOrCreateUser(interaction.user.id) as any;

        switch(game.result)
        {
            case 'WIN': {
                if(amount > 0)
                    await updateUser(interaction.user.id, BigInt(fetchedUser.user.balance + BigInt(amount)) * BigInt(2));
                break;
            }

            case 'LOSE': {
                if(amount > 0)
                    await updateUser(interaction.user.id, (BigInt(fetchedUser.user.balance)) - BigInt(amount));
                
                    break;
            }

            default: {
                break;
            }
        }
    }
}

export default new CoinflipCommand();