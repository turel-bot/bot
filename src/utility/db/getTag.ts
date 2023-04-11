import type { Tag } from '@prisma/client';
import { prismaClient } from '../../index';
import type OKType from '../OKType';

async function getTag(name: string, guild: string): Promise<OKType<Tag>>
{
    const query = await prismaClient.tag.findFirst({
        where: {
            name: name,
            guild: guild
        }
    });

    if(query === null)
        return {
            ok: false,
            data: null
        };

    return {
        ok: true,
        data: query
    };
}

export default getTag;