import type { GuildMember, User } from 'discord.js';
import { client } from '../../index';

async function Cooldown(user: GuildMember | User, command: string, time: number): Promise<{ new: boolean, time: number, command: string; }>
{
    const cooldown = client.cooldowns.get(user.id);

    if(!cooldown)
    {
        client.cooldowns.set(user.id, { time: time, command: command });

        setTimeout(() =>
        {
            client.cooldowns.delete(user.id);
        }, time);

        return Promise.resolve({ new: true, time: time, command: command });
    }

    return Promise.resolve({ new: false, time: time, command: command });
}

export default Cooldown;