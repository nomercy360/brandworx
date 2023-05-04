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

    const {promo} = params;

    // To Upper Case
    const promoCode = promo.toUpperCase();

    const ps = context.env.BRANDWORX_DB.prepare('SELECT * from PromoCodes WHERE code = ? LIMIT 1');
    const data = await ps.bind(promoCode).first();

    if (!data) {
        return Response.json({
            error: 'Promo code not found',
        }, {
            status: 404,
        });
    }

    return Response.json(data);
}