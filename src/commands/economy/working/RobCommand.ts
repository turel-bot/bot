import type { ChatInputCommandInteraction, User } from 'discord.js';
import { SlashCommandBuilder } from 'discord.js';
import Cooldown from '../../../utility/cooldown/Cooldown';
import Command from '../../../structures/Command';
import { updateUser } from '../../../utility/db/updateUser';
import findOrCreateUser from '../../../utility/db/FindOrCreateUser';

const failMessages: string[] = [
    'You fumbled the bag.',
    ':x: Failed to rob them.',
    '{0} pulled out a gun and blickied you.',
    'You tripped while trying to mug {0} and they ran away!'
];

const robbedBack: string[] = [
    'You dropped the gun while trying to rob {0} and he picked it up and robbed you.'
];

function getFailMessage(array: string[], user: User): string
{
    return array[Math.floor(Math.random() * array.length)].replace('{0}', `<@${ user.id }>`);
}

class RobCommand extends Command
{
    public constructor()
    {
        super(
            new SlashCommandBuilder()
                .setName('rob')
                .addUserOption(
                    input =>
                        input.setName('user')
                            .setDescription('The person to rob.')
                            .setRequired(true)
                )
                .setDescription('Steal a fuckers money.')
        );
    }

    public async execute(interaction: ChatInputCommandInteraction): Promise<any>
    {
        // 10m
        const cooldown = await Cooldown(interaction.user, 'rob', 600000);

        if(!cooldown.new && cooldown.command === 'rob')
        {
            await interaction.reply({
                embeds: [{
                    title: ':x: You are currently on cooldown.',
                }]
            });

            return;
        }

        const robbedUser: User = interaction.options.getUser('user', true);

        if(interaction.user.id === robbedUser.id)
        {
            await interaction.reply({
                embeds: [{
                    title: ':x: Cannot rob yourself.'
                }]
            });

            return;
        }

        const isAllowed: boolean = Math.random() < 0.4;

        if(robbedUser.id === interaction.client.user.id)
        {
            await updateUser(interaction.user.id, 0);
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

        if(!isAllowed)
        {
            const robbedYourAssBack: boolean = Math.random() > 0.25;

            if(robbedYourAssBack)
            {
                const dbSenderUser: { ok: true, user: { balance: number; }; } = await findOrCreateUser(interaction.user.id) as any;
                const dbRobbedUser: { ok: true, user: { balance: number; }; } = await findOrCreateUser(robbedUser.id) as any;

                if(dbRobbedUser.user.balance <= 0)
                    return;

                const amountStolen: number = Math.floor(Math.random() * dbSenderUser.user.balance);

                await updateUser(robbedUser.id, dbRobbedUser.user.balance + amountStolen);
                await updateUser(interaction.user.id, dbSenderUser.user.balance - amountStolen);

                await interaction.reply(`${ getFailMessage(robbedBack, robbedUser) }\n${ robbedUser } took ${ amountStolen.toLocaleString() }`);
                return;
            }


            await interaction.reply(getFailMessage(failMessages, robbedUser));
            return;
        }

        const dbSenderUser: { ok: true, user: { balance: number; }; } = await findOrCreateUser(interaction.user.id) as any;
        const dbRobbedUser: { ok: true, user: { balance: number; }; } = await findOrCreateUser(robbedUser.id) as any;

        if(dbRobbedUser.user.balance <= 0)
        {
            await interaction.reply('You tried to rob a homeless person. What\'s wrong with you?');
            return;
        }

        const amountStolen: number = Math.floor(Math.random() * dbRobbedUser.user.balance);

        await updateUser(robbedUser.id, dbRobbedUser.user.balance - amountStolen);
        await updateUser(interaction.user.id, dbSenderUser.user.balance + amountStolen);

        await interaction.reply(`You robbed ${ robbedUser } and walked away with ${ amountStolen.toLocaleString() }.`);
    }
}

export default new RobCommand();