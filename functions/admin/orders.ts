interface Env {
    BRANDWORX_DB: D1Database;
}

export async function onRequest(context) {
    const {
        request,
        env,
        params,
        waitUntil,
    } = context;

    const ps = context.env.BRANDWORX_DB.prepare('SELECT * from Orders');
    const {results} = await ps.all();

    if (!results) {
        return Response.json({
            error: 'Orders not found',
        }, {
            status: 404,
        });
    }

    return Response.json(results);
}