import type OKType from 'src/utility/OKType';
import type Command from '../../../structures/Command';
import type { ChatInputCommandInteraction } from 'discord.js';
import type { User as DBUser } from '@prisma/client';
import findOrCreateUser from '../../../utility/db/FindOrCreateUser';
import CooldownHandler from '../../../cooldowns/CooldownHandler';
import Cooldown from '../../../cooldowns/Cooldown';
import { SlashCommandBuilder } from 'discord.js';
import { updateUser } from '../../../utility/db/updateUser';

const BegCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('beg')
        .setDescription('Beg for some money you broke hoe'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        // 1m
        const cooldown: Cooldown | null = CooldownHandler.getInstance().getCooldown(interaction.user.id, 'beg');

        if(cooldown !== null && cooldown.isActive()) {
            await interaction.reply({
                embeds: [{
                    title: ':x: You are currently on cooldown.',
                }]
            });

            return;
        }

        const isAllowed: boolean = Math.random() < 0.5;

        if(!isAllowed) {
            await interaction.reply('You begged and got nothing. Go get a job.');
            return;
        }

        const amountRecieved: number = Math.floor(Math.random() * 1001);

        await interaction.reply(`You begged and recieved ${amountRecieved.toLocaleString()} bottlecaps!`);
        const fetchUser: OKType<DBUser> = await findOrCreateUser(interaction.user.id) as any;

        await updateUser(interaction.user.id, BigInt(fetchUser.data.balance) + BigInt(amountRecieved));

        CooldownHandler.getInstance().addCooldown(interaction.user.id, new Cooldown(interaction.user.id, 'beg', 60_000));
    }
} as const;

export default BegCommand;