interface Env {
    BRANDWORX_DB: D1Database;
}

import jwt from '@tsndr/cloudflare-worker-jwt'

export async function onRequest(context) {
    const {request, env} = context;

    let data;
    const contentType = request.headers.get("content-type");
    if (contentType.includes("application/json")) {
        data = await request.json();
    } else {
        return new Response("Request type not supported", {status: 400});
    }

    const {username, password} = data;

    if (!username || !password) {
        return Response.json({
            error: 'Missing required fields',
        }, {
            status: 400,
        });
    }

    const ps = context.env.BRANDWORX_DB.prepare('SELECT * FROM Admin WHERE username = ?');
    const admin = await ps.bind(username).first();

    if (admin && await comparePasswordHash(password, admin.password)) {
        const token = await jwt.sign({username: admin.username}, 'SECRET_KEY', {expiresIn: '1h'});
        const response = new Response(JSON.stringify({success: true}), {status: 200});
        response.headers.append('Set-Cookie', `authToken=${token}; Path=/; Max-Age=3600; HttpOnly; SameSite=Lax`);
        return response;
    } else {
        return new Response(JSON.stringify({success: false, error: 'Invalid credentials'}), {status: 401});
    }
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function comparePasswordHash(password, hash) {
    const hashedPassword = await hashPassword(password);
    return hashedPassword === hash;
}