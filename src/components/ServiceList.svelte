<script>
    import {createEventDispatcher} from 'svelte';
    import ServiceItem from './ServiceItem.svelte';
    import FormFields from "./FormFields.svelte";
    import CheckoutFields from "./CheckoutFields.svelte";
    import ContactUsButton from "./ContactUsButton.svelte";

    const services = [
        {
            id: 1,
            title: 'Logotype',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 300
        },
        {
            id: 2,
            title: 'Visual Identity',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 300
        },
        {
            id: 3,
            title: 'Social network templates',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 300
        },
        {
            id: 4,
            title: 'Ad creatives',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 300
        },
        {
            id: 5,
            title: 'Pitch-deck',
            description: 'We know how to increase conversion changing only texts. So we will describe and illustrate your product to attract customers and investors.',
            price: 300
        },
        {
            id: 6,
            title: 'Website',
            description: 'Increase engagement and conversions of your social media with Google, Youtube, Instagram, ot twitter media plan, based on data and interests of your audience.',
            price: 300
        }
    ];
    export let selectedServices = new Set();
    export let commissionPercentage = 4;
    export let promoCodeDiscount = 0;
    export let totalPriceDiscounted = 0;

    const dispatch = createEventDispatcher();

    function handleToggleService(e) {
        const id = parseInt(e.detail.id);
        const price = parseFloat(e.detail.price);

        if (selectedServices.has(id)) {
            selectedServices.delete(id);
        } else {
            selectedServices.add(id);
        }

        updateTotalPrice();
        dispatch('update:selectedServices', selectedServices);
        console.log(selectedServices);
    }

    function updateTotalPrice() {
        let totalPrice = 0;
        for (let service of selectedServices) {
            totalPrice += services.find((s) => s.id === service).price;
        }
        calculateTotalPriceDiscounted(totalPrice);
    }

    function calculateTotalPriceDiscounted(totalPrice) {
        let discountedPrice = totalPrice * (1 - promoCodeDiscount / 100);
        let commission = discountedPrice * (commissionPercentage / 100);
        totalPriceDiscounted = discountedPrice + commission;
        renderPaypalButtons();
    }

    $: if (promoCodeDiscount > 0) {
        updateTotalPrice();
    }

    let name = '';
    let social = '';
    let email = '';
    let zone = '';

    let currentScreen = 0;

    function goToNextScreen() {
        if (currentScreen < 2) {
            currentScreen++;

            // If on the second screen, render PayPal buttons
            if (currentScreen === 2) {
                renderPaypalButtons(true);
            }
        }
    }

    function goToPreviousScreen() {
        if (currentScreen > 0) {
            currentScreen--;
        }
        // Hide PayPal buttons
        if (currentScreen === 1) {
            const paypalButtonsContainer = document.querySelector("#paypal-buttons-mobile");
            paypalButtonsContainer.style.display = "none";
        }
    }

    let paypalButtonRendered = false;

    let formIsValid = false;

    function handleFormValidated(event) {
        formIsValid = event.detail;
    }

    function renderPaypalButtons(mobile = false) {
        let paypalButtonsContainer;
        if (mobile) {
            paypalButtonsContainer = document.querySelector("#paypal-buttons-mobile");
        } else {
            paypalButtonsContainer = document.querySelector("#paypal-buttons");
        }

        if (!mobile && window.innerWidth < 768) {
            return;
        }

        if (totalPriceDiscounted > 0) {
            paypalButtonsContainer.style.display = "block";
        } else {
            paypalButtonsContainer.style.display = "none";
        }

        if (!paypalButtonRendered && totalPriceDiscounted > 0) {
            paypal.Buttons({
                onClick: function (data, actions) {
                    const isVerified = validateForm();
                    console.log(isVerified);
                    return isVerified;
                },
                createOrder: async function (data, actions) {
                    return await createDbOrder();
                },
                onApprove: async function (data, actions) {
                    const result = await captureOrder(data.orderID);
                    if (result.status === "COMPLETED") {
                        window.location.href = "/order-success";
                    } else {
                        window.location.href = "/order-failed";
                    }
                },
                style: {
                    color: 'blue', // or 'gold', 'blue', 'silver', 'white', 'black'
                    shape: 'rect', // or 'pill'
                    label: 'checkout', // or 'buynow', 'pay', 'installment'
                    size: 'responsive', // or 'small', 'medium', 'large'
                    height: 48, // Optional, specify the height of the button
                },
            }).render(`#paypal-buttons${mobile ? '-mobile' : ''}`); // Renders the PayPal button

            paypalButtonRendered = true;
        }
    }

    async function captureOrder(orderID) {
        const response = await fetch("/api/capture-paypal-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paypalOrderId: orderID,
            })
        });

        return await response.json();
    }

    async function createDbOrder() {
        try {
            const response = await fetch('/api/create-paypal-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    social: social,
                    email: email,
                    zone: zone,
                    services: Array.from(selectedServices),
                    total: totalPriceDiscounted,
                    discount: promoCodeDiscount
                })
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            } else {
                const data = await response.json();
                return data.id;
            }
        } catch (error) {
            // Show an error message to the user
            console.error('Error creating order:', error);
        }
    }

    let nameError = '';
    let socialError = '';
    let emailError = '';
    let zoneError = '';

    export function validateForm() {
        if (!name) {
            nameError = 'Please enter your name.';
        } else {
            nameError = '';
        }

        if (!social) {
            socialError = 'Please enter your social link.';
        } else {
            socialError = '';
        }

        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            emailError = 'Please enter a valid email address.';
        } else {
            emailError = '';
        }

        if (!zone) {
            zoneError = 'Please enter your time zone.';
        } else {
            zoneError = '';
        }

        return !nameError && !socialError && !emailError && !zoneError;
    }

</script>

<div class="mobile mx-auto">
    <div class="flex flex-col items-center justify-start min-h-screen pb-24">
        <div class="flex flex-row items-center justify-between w-full">
            <button class="font-bold" on:click={goToPreviousScreen}>
                Back
            </button>
            <div class="flex flex-row gap-0.5">
                <div class={`w-12 h-1 ${currentScreen >= 0 ? 'bg-primary' : 'bg-light-gray'}`}></div>
                <div class={`w-12 h-1 ${currentScreen >= 1 ? 'bg-primary' : 'bg-light-gray'}`}></div>
                <div class={`w-12 h-1 ${currentScreen >= 2 ? 'bg-primary' : 'bg-light-gray'}`}></div>
            </div>
            <p class="font-bold">
                Step {currentScreen + 1}/3
            </p>
        </div>
        {#if currentScreen === 0}
            <p class="text-3xl font-bold text-center">
                Select services
            </p>
            <p class="text-xl font-medium opacity-60 text-center">
                Feel free to contact us, if you need something special.
            </p>
            <div class="grid grid-cols-2 w-full gap-2 mt-8 items-stretch">
                {#each services as service (service.id)}
                    <ServiceItem
                            id={service.id}
                            title={service.title}
                            description={service.description}
                            price={service.price}
                            selected={selectedServices.has(service.id)}
                            on:toggleService={handleToggleService}
                    />
                {/each}
            </div>
        {:else if currentScreen === 1}
            <p class="text-3xl font-bold text-center">
                Provide contacts
            </p>
            <p class="text-xl font-medium opacity-60 text-center mb-8">
                We’ll contact you in working hours.
            </p>
            <FormFields bind:name={name} bind:email={email} bind:social={social} bind:zone={zone}
                        nameError={nameError} emailError={emailError} socialError={socialError} zoneError={zoneError}/>
        {:else if currentScreen === 2}
            <p class="text-3xl font-bold mt-5">
                Review your order
            </p>
            <p class="text-xl font-medium opacity-60">
                Money-back guarantee.
            </p>
            <CheckoutFields
                    totalPrice={totalPriceDiscounted.toFixed(2)}
                    commissionPercentage={commissionPercentage}
                    promoCodeDiscount={promoCodeDiscount}
            />

        {/if}
        <div class="fixed bottom-0 left-0 w-full right-0 px-4 py-5 bg-secondary">
            <div id="paypal-buttons-mobile"></div>
            {#if currentScreen === 0}
                <button class="w-full bg-primary text-white font-bold text-xl py-3 rounded-lg"
                        on:click={goToNextScreen}>
                    Next
                </button>
            {:else if currentScreen === 1}
                <p class="opacity-40 mb-5 font-medium">
                    By taping checkout button, you agree to the Terms of Service & Privacy Policy
                </p>
                <button class="w-full bg-primary text-white font-bold text-xl py-3 rounded-lg"
                        on:click={goToNextScreen}>
                    Next
                </button>
            {:else if currentScreen === 2}
                <p class="opacity-60 mb-3 font-medium text-lg text-center">
                    If you prefer WireTransfer, Deel, or Cryptocurrency, just contact us.
                </p>
                <ContactUsButton marginBottom={20}/>
            {/if}
        </div>
    </div>
</div>

<div class="flex flex-row gap-5 desktop">
    <div class="flex flex-col items-start justify-start bg-secondary w-3/4">
        <p class="text-3xl font-bold">
            Select services
        </p>
        <p class="text-xl font-medium opacity-60">
            Feel free to contact us, if you need something special.
        </p>
        <div class="grid grid-cols-2 w-full gap-5 mt-8">
            {#each services as service (service.id)}
                <div class="mt-18">
                    <ServiceItem
                            id={service.id}
                            title={service.title}
                            description={service.description}
                            price={service.price}
                            selected={selectedServices.has(service.id)}
                            on:toggleService={handleToggleService}
                    />
                </div>
            {/each}
        </div>
    </div>
    <div class="">
        <p class="text-3xl font-bold">
            Provide contacts
        </p>
        <p class="text-xl font-medium opacity-60 mb-6">
            We’ll contact you in working hours.
        </p>
        <FormFields on:formValidated={handleFormValidated}
                    bind:name={name}
                    bind:email={email}
                    bind:social={social}
                    bind:zone={zone}
                    nameError={nameError}
                    emailError={emailError}
                    socialError={socialError}
                    zoneError={zoneError}
        />

        <p class="text-3xl font-bold mt-5">
            Review your order
        </p>
        <p class="text-xl font-medium opacity-60">
            Money-back guarantee.
        </p>
        <CheckoutFields
                totalPrice={totalPriceDiscounted.toFixed(2)}
                commissionPercentage={commissionPercentage}
                bind:promoCodeDiscount={promoCodeDiscount}
        />
        <p class="opacity-60 text-lg font-medium mt-6 mb-7">
            If you prefer WireTransfer, Deel, or Cryptocurrency, just contact us.
        </p>
        <ContactUsButton marginBottom={14}/>
        <div id="paypal-buttons"></div>
    </div>
</div>

<style>
    .mobile {
        visibility: hidden;
        display: none;
    }

    @media (max-width: 768px) {
        .mobile {
            visibility: visible;
            display: block;
        }

        .desktop {
            visibility: hidden;
            display: none;
        }
    }

    #paypal-buttons, #paypal-buttons-mobile {
        display: none;
    }
</style>