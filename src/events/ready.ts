import type TClient from '../structures/TClient';
import Event from '../structures/Event';

class ready extends Event
{
    constructor()
    {
        super('ready');
    }

    public async execute(client: TClient): Promise<void>
    {
        console.log(`Logged in on account ${ client.user?.tag } on ${ new Date() }`);
    }
}

export default new ready();