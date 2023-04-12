import { prismaClient } from '../../../index';
import type OKType from '../../OKType';

async function deleteTag(id: string): Promise<OKType>
{
    const query = await prismaClient.tag.delete({
        where: {
            id: id
        }
    });

    return {
        ok: query === null,
        data: null
    };
}

export default deleteTag;
export { deleteTag };