interface Env {
    BRANDWORX_DB: D1Database;
    PAYPAL_CLIENT_ID: string;
    PAYPAL_CLIENT_SECRET: string;
    PAYPAL_API_BASE: string;
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHAT_ID: string;
}

export async function sendTelegramMessage(botToken, chatId, message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
        })
    });

    return await response.json();
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

async function capturePayPalOrder(orderId, payPalClientId, payPalClientSecret, payPalApiBase) {
    const accessToken = await generatePayPalAccessToken(payPalClientId, payPalClientSecret, payPalApiBase);
    const url = payPalApiBase + "/v2/checkout/orders/" + orderId + "/capture";

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + accessToken,
        }
    })

    return await response.json();
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

    if (!data.paypalOrderId) {
        return Response.json({error: 'Missing required fields'}, {status: 400});
    }

    // Capture the PayPal order
    const payPalOrderResponse = await capturePayPalOrder(data.paypalOrderId, env.PAYPAL_CLIENT_ID, env.PAYPAL_CLIENT_SECRET, env.PAYPAL_API_BASE);

    // @ts-ignore
    const status = payPalOrderResponse.status;

    // @ts-ignore
    if (status !== "COMPLETED") {
        return Response.json({error: 'PayPal order not completed'}, {status: 400});
    }

    // Update the order in the database
    const ps = env.BRANDWORX_DB.prepare('Update Orders SET status = ? WHERE paypal_order_id = ? RETURNING *');
    const dbResult = await ps.bind(status, data.paypalOrderId).first()

    if (dbResult) {
        // Send a message to the Telegram group when the order status changes
        const botToken = env.TELEGRAM_BOT_TOKEN;
        const chatId = env.TELEGRAM_CHAT_ID;
        // @ts-ignore
        const message = `*Order status changed*\n\n*Order ID:* ${dbResult.id}\n*PayPal Order ID:* ${data.paypalOrderId}\n*Status:* ${status}`;

        // Use waitUntil to avoid blocking the main execution
        waitUntil(sendTelegramMessage(botToken, chatId, message));

        // Email the customer
        const services = JSON.parse(dbResult.services);

        const servicesForEmail = services.map(service => {
            return {
                name: service.title,
                price: service.price,
                quantity: 1,
            }
        })

        waitUntil(sendEmailOrderConfirmation(dbResult.email, servicesForEmail, 'Some address', dbResult.total));

        return Response.json({orderId: dbResult.id, paypalOrderId: data.paypalOrderId, status: status});
    } else {
        return Response.json({error: 'Something went wrong'}, {status: 500});
    }
}

async function sendEmailOrderConfirmation(address, services, billingAddress, totalPrice) {
    const data = {
        to: address,
        subject: "Order Confirmation",
        data: {
            totalPrice: totalPrice,
            services: services,
            billingAddress: billingAddress,
        }
    }

    const lambdaUrl = "https://tyc2u7lzldapvoqg7rg2irkuae0jbfjd.lambda-url.eu-central-1.on.aws";

    const res = await fetch(lambdaUrl, {
        method: 'POST',
        body: JSON.stringify(data),
    })

    if (res.status !== 200) {
        throw new Error("Error sending email");
    }
}

