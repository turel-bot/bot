import { prismaClient } from '../../index';
import type { User } from '@prisma/client';
import type OKType from '../OKType';

async function createUser(id: string): Promise<OKType<User>> {
    const newUser = await prismaClient.user.create({
        data: {
            id: id,
            balance: 100
        }
    });

    return {
        ok: true,
        data: newUser
    };
}

export default createUser;