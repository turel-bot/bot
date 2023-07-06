import type { User } from '@prisma/client';
import { prismaClient } from '../../index';
import type OKType from '../OKType';
import createUser from './createUser';

async function findOrCreateUser(id: string): Promise<OKType<User>> {
    const query = await prismaClient.user.findFirst({
        where: {
            id: id
        }
    });

    if(query === null)
        return createUser(id);

    return {
        ok: true,
        data: query
    };
}

export default findOrCreateUser;