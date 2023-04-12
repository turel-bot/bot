import type { Tag } from '@prisma/client';
import { prismaClient } from '../../../index';
import type OKType from '../../OKType';

async function getTag(name: string, guild: string): Promise<OKType<Tag>>
{
    const query = await prismaClient.tag.findFirst({
        where: {
            name: name,
            guild: guild
        }
    });

    return {
        ok: query === null,
        data: query
    };
}

export default getTag;
export { getTag };