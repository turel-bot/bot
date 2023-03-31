import { config } from 'dotenv'; config();
import TClient from './structures/TClient';
import { PrismaClient } from '@prisma/client';

const prismaClient: PrismaClient = new PrismaClient();
const client: TClient = new TClient({
    intents: [
        'Guilds', 'GuildEmojisAndStickers'
    ],
    partials: [],
    // razer gaming phone moment
    ws: {
        properties: {
            browser: 'Discord iOS'
        }
    }
});

client.init(process.env.token)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch((r) => { throw r; });

process.on('beforeExit', async () => prismaClient.$disconnect());

export
{
    prismaClient,
    client
};