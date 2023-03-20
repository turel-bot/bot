import type { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Command from '../../../structures/Command';
import { updateUser } from '../../../utility/db/updateUser';
import findOrCreateUser from '../../../utility/db/FindOrCreateUser';
import CooldownHandler from '../../../cooldowns/CooldownHandler';
import Cooldown from '../../../cooldowns/Cooldown';

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
        const cooldown: Cooldown | null = CooldownHandler.getInstance().getCooldown(interaction.user.id, 'beg');

        if(!cooldown || cooldown.isActive())
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
        const fetchUser: { ok: true, user: { balance: bigint; }; } = await findOrCreateUser(interaction.user.id) as any;

        await updateUser(interaction.user.id, BigInt(fetchUser.user.balance) + BigInt(amountRecieved));
        CooldownHandler.getInstance().addCooldown(interaction.user.id, new Cooldown(interaction.user.id, 'beg', 60_000));
    }
}

export default new BegCommand();