import jwt from '@tsndr/cloudflare-worker-jwt';

const SECRET_KEY = 'SECRET_KEY'; // Replace with your own secret key

async function authentication(context) {
    const {request} = context;
    const cookies = request.headers.get('Cookie') || '';

    const authToken = cookies.split('; ').find(cookie => cookie.startsWith('authToken='));

    if (authToken) {
        const token = authToken.split('=')[1];
        try {
            await jwt.verify(token, SECRET_KEY);
            return context.next();
        } catch (err) {
            // Redirect to login page, 301 is permanent redirect, 302 is temporary
            return new Response('Unauthorized', {status: 302, headers: {'Location': '/login'}});
        }
    } else {
        return new Response('Unauthorized', {status: 302, headers: {'Location': '/login'}});
    }
}

export const onRequest = [authentication];
