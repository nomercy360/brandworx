export async function onRequest(context) {
    return new Response('OK', {
        status: 302,
        headers: {
            'Location': '/login',
            'Set-Cookie': 'authToken=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
        }
    });
}
