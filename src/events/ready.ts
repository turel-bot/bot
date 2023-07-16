import type TClient from '../structures/TClient';
import type Event from '../structures/Event';
import { prismaClient } from '../index';

const ready: Event<'ready'> = {
    name: 'ready',
    async execute(client: TClient): Promise<void> {
        console.log(`Logged in on account ${client.user?.tag} on ${new Date()}`);
        // client.user?.setActivity('on a Razer Gaming Phone', { type: ActivityType.Streaming, url: 'https://twitch.tv/turelbot' });

        const status = await prismaClient.status.findFirst({
            where: {
                shard: 0
            }
        });

        client.user?.setActivity(status?.text ?? 'razer gaming phone', { type: status?.type, url: status?.type === 1 ? status.url ?? 'https://twitch.tv/turelbot' : '' });
    },
} as const;

export default ready;