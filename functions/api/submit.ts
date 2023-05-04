interface Env {
    BRANDWORX_DB: D1Database;
}

//      async function submit() {
//         const response = await fetch('/api/submit', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 name: name,
//                 social: social,
//                 email: email,
//                 zone: zone,
//                 services: Array.from(selectedServices),
//                 total: totalPriceDiscounted,
//                 discount: promoCodeDiscount
//             })
//         });
//
//         const data = await response.json();
//
//         if (data.success) {
//             alert('Your order has been submitted successfully!');
//         } else {
//             alert('There was an error submitting your order. Please try again later.');
//         }
//     }

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

    console.log(data.name);

    if (!data.name || !data.social || !data.email || !data.zone || !data.services || !data.total) {
        return Response.json({
            error: 'Missing required fields',
        }, {
            status: 400,
        });
    }

    const ps = context.env.BRANDWORX_DB.prepare('INSERT INTO Orders (name, social, email, zone, services, total, discount) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *');

    const res = await ps.bind(data.name, data.social, data.email, data.zone, data.services, data.total, data.discount).first()

    return Response.json({
        success: true,
        data: res
    });
}