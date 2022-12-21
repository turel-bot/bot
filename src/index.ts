import TClient from './structures/TClient';
import config from '../config.json';
import { PrismaClient } from '@prisma/client';

const prismaClient: PrismaClient = new PrismaClient();
const client: TClient = new TClient({
    intents: [
        'Guilds'
    ],
    partials: [],
    // razer gaming phone moment
    ws: {
        properties: {
            browser: 'Discord iOS'
        }
    }
});

client.init(config.token)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch((r) => { throw r; });

process.on('beforeExit', async () => prismaClient.$disconnect());

export
{
    prismaClient,
    client
};