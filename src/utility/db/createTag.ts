import type { Tag } from '@prisma/client';
import { prismaClient } from '../../index';
import type OKType from '../OKType';
import getTag from './getTag';
import { v4 } from 'uuid';

async function createTag(name: string, guild: string, content: string, author: string): Promise<OKType<Tag> | null>
{
    const findTag: OKType<Tag> = await getTag(name, guild);
    if(!findTag.ok || findTag === null) return null;

    const newTag = await prismaClient.tag.create({
        data: {
            id: v4(),
            content: content,
            name: name,
            guild: guild,
            author: author
        }
    });

    return {
        ok: true,
        data: newTag
    };
}

export default createTag;