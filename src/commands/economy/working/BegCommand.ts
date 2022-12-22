import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Cooldown from '../../../utility/cooldown/Cooldown';
import Command from '../../../structures/Command';
import { updateUser } from '../../../utility/db/updateUser';
import findOrCreateUser from '../../../utility/db/FindOrCreateUser';

class BegCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
                .setName('beg')
                .setDescription('Beg for some money you broke hoe')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        // 1m
        const cooldown = await Cooldown(interaction.user, 'beg', 60_000);

        if(!cooldown.new && cooldown.command === 'beg')
        {
            await interaction.reply({
                embeds: [{
                    title: ':x: You are currently on cooldown.',
                }]
            });

            return;
        }

        const isAllowed: boolean = Math.random() < 0.5;

        if(!isAllowed)
        {
            await interaction.reply('You begged and got nothing. Go get a job.');
            return;
        }

        const amountRecieved: number = Math.floor(Math.random() * 1001);

        await interaction.reply(`You begged and recieved ${ amountRecieved.toLocaleString() } bottlecaps!`);
        const fetchUser: { ok: true, user: { balance: number; }; } = await findOrCreateUser(interaction.user.id) as any;

        await updateUser(interaction.user.id, fetchUser.user.balance + amountRecieved);
    }
}

export default new BegCommand();