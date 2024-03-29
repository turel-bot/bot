import type { ChatInputCommandInteraction, User } from 'discord.js';
import type { User as DBUser } from '@prisma/client';
import type OKType from 'src/utility/OKType';
import { SlashCommandBuilder } from 'discord.js';
import { updateUser } from '../../../utility/db/updateUser';
import type Command from '../../../structures/Command';
import findOrCreateUser from '../../../utility/db/FindOrCreateUser';
import CooldownHandler from '../../../cooldowns/CooldownHandler';
import Cooldown from '../../../cooldowns/Cooldown';

const failMessages: readonly string[] = [
    'You fumbled the bag.',
    ':x: Failed to rob them.',
    '{0} pulled out a gun and blickied you.',
    'You tripped while trying to mug {0} and they ran away!'
] as const;

const robbedBackMessages: readonly string[] = [
    'You dropped the gun while trying to rob {0} and he picked it up and robbed you of {1}.',
    'How you just fail to rob someone? {0} stole {1} from you.',
    '{0} stole {1} from you, improve.',
    'Owch, you suck at your job. {0} stole {1}.'
] as const;

function getFailMessage(array: readonly string[], user: User): string {
    return array[Math.floor(Math.random() * array.length)]
        .replace('{0}', `<@${user.id}>`);
}

const RobCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('rob')
        .addUserOption(
            input =>
                input.setName('user')
                    .setDescription('The person to rob.')
                    .setRequired(true)
        )
        .setDescription('Steal a fuckers money.'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        // 10m
        const cdh: CooldownHandler = CooldownHandler.getInstance();
        const cooldown: Cooldown | null = cdh.getCooldown(interaction.user.id, 'rob');

        if(cooldown !== null && cooldown.isActive()) {
            await interaction.reply({
                embeds: [{
                    title: ':x: You are currently on cooldown.',
                }]
            });

            return;
        }

        const robbedUser: User = interaction.options.getUser('user', true);

        if(interaction.user.id === robbedUser.id) {
            await interaction.reply({
                embeds: [{
                    title: ':x: Cannot rob yourself.'
                }]
            });

            return;
        }

        const isAllowed: boolean = Math.random() < 0.4;

        if(robbedUser.id === interaction.client.user.id) {
            await updateUser(interaction.user.id, BigInt(0));
            await interaction.reply({
                embeds: [{
                    title: 'You tried to rob god. This does not work out for you.',
                    footer: {
                        text: 'Your balance was set to 0. Dont fuck with turel.',
                        icon_url: 'https://media.discordapp.net/attachments/1024392785241063486/1054613951075332136/output-onlinegiftools.gif'
                    },
                    image: {
                        url: 'https://media.discordapp.net/attachments/1024392785241063486/1054613951075332136/output-onlinegiftools.gif'
                    }
                }]
            });
            return;
        }

        if(!isAllowed) {
            const didRobBack: boolean = Math.random() > 0.25;

            if(didRobBack) {
                const dbSenderUser: OKType<DBUser> = await findOrCreateUser(interaction.user.id);
                const dbRobbedUser: OKType<DBUser> = await findOrCreateUser(robbedUser.id);

                if(dbRobbedUser.data.balance <= 0)
                    return;

                const amountStolen: number = Math.floor(Math.random() * Number(dbSenderUser.data.balance));

                await updateUser(robbedUser.id, BigInt(dbRobbedUser.data.balance) + BigInt(amountStolen));
                await updateUser(interaction.user.id, BigInt(dbSenderUser.data.balance) - BigInt(amountStolen));

                await interaction.reply(`${getFailMessage(robbedBackMessages, robbedUser).replace('{1}', amountStolen.toLocaleString())}`);
                return;
            }


            await interaction.reply(getFailMessage(failMessages, robbedUser));
            return;
        }

        const dbSenderUser: OKType<DBUser> = await findOrCreateUser(interaction.user.id) as any;
        const dbRobbedUser: OKType<DBUser> = await findOrCreateUser(robbedUser.id) as any;

        if(dbRobbedUser.data.balance <= 0) {
            await interaction.reply('You tried to rob a homeless person. What\'s wrong with you?');
            return;
        }

        const amountStolen: bigint = BigInt(Math.floor(Math.random())) * dbRobbedUser.data.balance;

        await updateUser(robbedUser.id, BigInt(dbRobbedUser.data.balance - amountStolen));
        await updateUser(interaction.user.id, BigInt(dbSenderUser.data.balance + amountStolen));

        await interaction.reply(`You robbed ${robbedUser} and walked away with ${amountStolen.toLocaleString()}.`);
        cdh.addCooldown(interaction.user.id, new Cooldown(interaction.user.id, 'rob', 600000));
    },
} as const;

export default RobCommand;