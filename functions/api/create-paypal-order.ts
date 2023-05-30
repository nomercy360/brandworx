import {sendTelegramMessage} from "./capture-paypal-order";

interface Env {
    BRANDWORX_DB: D1Database;
    PAYPAL_CLIENT_ID: string;
    PAYPAL_CLIENT_SECRET: string;
    PAYPAL_API_BASE: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHAT_ID: string;
}


async function generatePayPalAccessToken(payPalClientId, payPalClientSecret, payPalApiBase) {
    const url = payPalApiBase + "/v1/oauth2/token";

    const response = await fetch(url, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + btoa(payPalClientId + ':' + payPalClientSecret),
        }
    });

    const json = await response.json();

    // @ts-ignore
    return json.access_token;
}

export async function onRequest(context) {
    const {
        request,
        env,
        params,
        waitUntil,
    } = context;

    let data;

    const contentType = request.headers.get("content-type");
    if (contentType.includes("application/json")) {
        data = await request.json();
    } else {
        return new Response("Request type not supported", {status: 400});
    }

    // social - social link, zone - time zone, total - total price with discount USD, discount - discount amount
    if (!data.name || !data.social || !data.email || !data.zone || !data.services || !data.total) {
        return Response.json({error: 'Missing required fields'}, {status: 400});
    }

    const orderData = {
        total: data.total,
    };

    const accessToken = await generatePayPalAccessToken(env.PAYPAL_CLIENT_ID, env.PAYPAL_CLIENT_SECRET, env.PAYPAL_API_BASE);

    const paypalOrder = await createPayPalOrder(orderData, accessToken, env.PAYPAL_API_BASE);

    const servicesString = JSON.stringify(data.services);

    const ps = context.env.BRANDWORX_DB.prepare('INSERT INTO Orders (name, social, email, zone, services, total, discount, paypal_order_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *');

    // @ts-ignore
    const order = await ps.bind(data.name, data.social, data.email, data.zone, servicesString, data.total, data.discount, paypalOrder.id, paypalOrder.status).first()

    if (!order) {
        return Response.json({error: 'Something went wrong'}, {status: 500});
    }

    // Send a message to the Telegram group when the order is created
    const botToken = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    // @ts-ignore
    const message = `*Order created*\n\n*Order ID:* ${order.id}\n*Name:* ${data.name}\n*Email: ${data.email}\n*Total:* ${data.total}\n*Status:* ${paypalOrder.status}`;

    // Use waitUntil to avoid blocking the main execution
    context.waitUntil(sendTelegramMessage(botToken, chatId, message));

    return Response.json(paypalOrder, {status: 200});
}


async function createPayPalOrder(orderData, accessToken, payPalApiBase) {
    const url = payPalApiBase + "/v2/checkout/orders";

    const requestBody = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "USD",
                    value: orderData.total.toString(),
                },
                description: "Brandworx services",
            },
        ],
    };

    const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to create PayPal order");
    }

    return await response.json();
}
