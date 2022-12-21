import { prismaClient } from '../../index';
import type OKType from '../OKType';

async function createUser(id: string): Promise<OKType>
{
    const newUser = await prismaClient.user.create({
        data: {
            id: id,
            balance: 100
        }
    });

    return {
        ok: true,
        user: newUser
    };
}

export default createUser;