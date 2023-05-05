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

async function capturePayPalOrder(orderId) {
    const accessToken = await generatePayPalAccessToken();
    const url = base + "/v2/checkout/orders/" + orderId + "/capture";

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
    const payPalOrderResponse = await capturePayPalOrder(data.paypalOrderId);

    // @ts-ignore
    const status = payPalOrderResponse.status;

    // @ts-ignore
    if (status !== "COMPLETED") {
        return Response.json({error: 'PayPal order not completed'}, {status: 400});
    }

    // Update the order in the database
    const ps = context.env.BRANDWORX_DB.prepare('Update Orders SET status = ? WHERE paypal_order_id = ? RETURNING *');
    const dbResult = await ps.bind(status, data.paypalOrderId).first()

    if (dbResult) {
        return Response.json({orderId: dbResult.id, paypalOrderId: data.paypalOrderId, status: status});
    } else {
        return Response.json({error: 'Something went wrong'}, {status: 500});
    }
}
