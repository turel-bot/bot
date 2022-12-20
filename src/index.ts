import TClient from './structures/TClient';
import config from '../config.json';

const client: TClient = new TClient({
    intents: [
        'Guilds'
    ],
    partials: []
});

client.init(config.token)
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .catch((r) => { console.log('failed?? ' + r); });