interface Env {
    BRANDWORX_DB: D1Database;
}

const base = "https://api-m.sandbox.paypal.com";


const PayPalClientId = "AWULcyDAI-rJl4RtQiRGpS-df_fMhBoiWX9ZvIyXwH1iv2nyAecqpWwdDCfvPar2FweiAzHoApM02yPu";
const PayPalClientSecret = "ECR_ofkNluBPg4_eH--jyWL-B7cNANaH_kpf1xhvlfgi8EScy8X5jK7vLm0OA18AgBuYuKkoeWXMftru";

async function generatePayPalAccessToken() {
    const url = base + "/v1/oauth2/token";

    const response = await fetch(url, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            'Authorization': 'Basic ' + btoa(PayPalClientId + ':' + PayPalClientSecret),
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

    const accessToken = await generatePayPalAccessToken();

    const paypalOrder = await createPayPalOrder(orderData, accessToken);

    const ps = context.env.BRANDWORX_DB.prepare('INSERT INTO Orders (name, social, email, zone, services, total, discount, paypal_order_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *');

    // @ts-ignore
    const order = await ps.bind(data.name, data.social, data.email, data.zone, data.services, data.total, data.discount, paypalOrder.id, paypalOrder.status).first()

    if (!order) {
        return Response.json({error: 'Something went wrong'}, {status: 500});
    }

    return Response.json({paypalOrder}, {status: 200});
}


async function createPayPalOrder(orderData, accessToken) {
    const url = base + "/v2/checkout/orders";

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
