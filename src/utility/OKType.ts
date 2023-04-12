interface OKType<B = null>
{
    ok: boolean;
    data: B | null;
}

export default OKType;