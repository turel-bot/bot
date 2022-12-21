import { prismaClient } from '../../index';
import type OKType from '../OKType';
import createUser from './createUser';

async function findOrCreateUser(id: string): Promise<OKType>
{
    const query = await prismaClient.user.findFirst({
        where: {
            id: id
        }
    });

    if(query === null)
        return createUser(id);

    return {
        ok: true,
        user: query
    };
}

export default findOrCreateUser;