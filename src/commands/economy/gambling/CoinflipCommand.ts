import type { ChatInputCommandInteraction } from 'discord.js';
import type { User as DBUser } from '@prisma/client';
import type OKType from '../../../utility/OKType';
import { updateUser, findOrCreateUser } from '../../../utility/db';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../../structures/Command';
import ParseIntWithCommas from '../../../utility/numbers/ParseIntWithCommas';

class CoinflipCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
                .setName('coinflip')
                .addStringOption(
                    input =>
                        input.setName('side')
                            .setDescription('The side to bet on.')
                            .addChoices(
                                { name: 'Heads', value: 'Heads' },
                                { name: 'Tails', value: 'Tails' }
                            )
                            .setRequired(true)
                )
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
        const amount = ParseIntWithCommas(interaction.options.getInteger('amount', false)!);
        const side = interaction.options.getString('side', true);

        if(side.toLowerCase() !== 'heads' && side.toLowerCase() !== 'tails')
        {
            await interaction.reply({ content: `The provided side \`${ side }\` is not a valid side.`, ephemeral: true });
            return;
        }

        const won: boolean = side === (Math.random() < 0.5 ? 'Heads' : 'Tails');

        if(amount === null || amount <= 0)
        {
            await interaction.reply({
                embeds: [{
                    title: `${ won ? 'You won!' : 'You lost!' }`,
                    description: 'You did not bet, not losing or gaining anything. Try betting next time?'
                }]
            });

            return;
        }

        const query: OKType<DBUser> = await findOrCreateUser(interaction.user.id);
        const user: DBUser = query.data!;

        if(!query.ok)
        {
            await interaction.reply({ content: 'Failed to fetch your details. Try again later.', ephemeral: true });
            return;
        }

        if(amount > user.balance)
        {
            await interaction.reply({
                embeds: [{
                    title: `:x: Lack of currency.`,
                    description: 'You do not have enough bottlecaps to bet that much!'
                }]
            });

            return;
        }

        await interaction.reply({
            embeds: [{
                title: `${ won ? 'You won!' : 'You lost!' }`,
                description: `${ won ? 'You won ' + (amount * 2).toLocaleString() + ' bottlecaps!' : 'You lost ' + amount + ' bottlecaps. :(' }`
            }]
        });

        if(won)
            await updateUser(interaction.user.id, BigInt(user.balance + BigInt(amount)) * BigInt(2));
        else
            await updateUser(interaction.user.id, BigInt(user.balance) - BigInt(amount));
    }
}

export default new CoinflipCommand();