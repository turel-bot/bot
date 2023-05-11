import type TClient from '../structures/TClient';
import Event from '../structures/Event';
import { prismaClient } from '../index';

class ready extends Event
{
    constructor()
    {
        super('ready');
    }

    public async execute(client: TClient): Promise<void>
    {
        console.log(`Logged in on account ${ client.user?.tag } on ${ new Date() }`);
        // client.user?.setActivity('on a Razer Gaming Phone', { type: ActivityType.Streaming, url: 'https://twitch.tv/turelbot' });
        
        const status = await prismaClient.status.findFirst({
            where: {
                shard: 0
            }
        });

        client.user?.setActivity(status!.text, { type: status?.type, url: status?.type === 1 ? status.url ?? 'https://twitch.tv/turelbot' : '' });
    }
}

export default new ready();