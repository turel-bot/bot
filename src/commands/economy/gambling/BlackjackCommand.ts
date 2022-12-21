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
                            .setRequired(true)
                )
                .setDescription('Gamble!')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        const game = await blackjack(interaction);
        const amount: number = interaction.options.getInteger('amount', true);
        const fetchedUser: { ok: boolean, user: { balance: number; }; } = await findOrCreateUser(interaction.user.id) as any;

        switch(game.result)
        {
            case 'WIN': {
                await updateUser(interaction.user.id, (fetchedUser.user.balance) + amount * 2);
                break;
            }

            case 'LOSE': {
                await updateUser(interaction.user.id, (fetchedUser.user.balance) - amount);
                break;
            }

            default: {
                break;
            }
        }
    }
}

export default new CoinflipCommand();