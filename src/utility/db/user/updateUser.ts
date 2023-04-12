import { prismaClient } from '../../../index';
import findOrCreateUser from './FindOrCreateUser';

async function updateUser(id: string, balance: bigint): Promise<{ uuid: string; balance: bigint; }>
{
    await findOrCreateUser(id);

    const user = await prismaClient.user.update({
        where: {
            id: id
        },
        data: {
            balance: balance
        }
    });

    return user;
}

export default updateUser;
export { updateUser };