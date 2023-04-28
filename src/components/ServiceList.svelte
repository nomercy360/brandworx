<script>
    import {createEventDispatcher} from 'svelte';
    import ServiceItem from './ServiceItem.svelte';

    const services = [
        {
            id: 1,
            title: 'Logotype',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 450
        },
        {
            id: 2,
            title: 'Visual Identity',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 450
        },
        {
            id: 3,
            title: 'Social network templates',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 450
        },
        {
            id: 4,
            title: 'Ad creatives',
            description: 'Unlimited revisions, expertly handcrafted logos, satisfaction guarantee without the hassle of the process for a flat fee in only two days.',
            price: 450
        }
    ];
    export let selectedServices = new Set();
    export let commissionPercentage = 4;
    export let promoCodeDiscount = 25;

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
    }

    function updateTotalPrice() {
        let totalPrice = 0;
        for (let service of selectedServices) {
            totalPrice += services.find((s) => s.id === service).price;
        }

        totalPrice += (totalPrice * commissionPercentage) / 100;
        totalPrice -= (totalPrice * promoCodeDiscount) / 100;

        document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;
    }
</script>

<div class="grid grid-cols-2 mt-14">
    <div class="flex flex-col items-start justify-start bg-green pt-8 pb-10 px-6 gap-6">
        <div class="flex flex-row gap-4">
            <div
                    class="w-9 h-9 border-4 flex items-center justify-center border-primary rounded-full font-black text-xl"
            >
                1
            </div>
            <p class="text-3xl font-bold">
                Choose the right Setup
            </p>
        </div>
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
        <div class="w-full flex flex-row justify-between items-center">
            <p class="text-xl">Payment provider commission</p>
            <p class="text-xl">{commissionPercentage}%</p>
        </div>
        <div class="w-full flex flex-row justify-between items-center">
            <p class="text-xl">Promo-code</p>
            <p class="text-xl">-{promoCodeDiscount}%</p>
        </div>
        <div class="bg-primary h-0.5 w-full"></div>
        <div class="w-full flex flex-row justify-between items-center">
            <p class="text-3xl font-bold">Total</p>
            <p id="total-price" class="text-3xl font-bold">$0.00</p>
        </div>
    </div>
    <div class="flex flex-col items-start justify-between bg-secondary pt-8 pb-10 px-6">
        <div class="w-full">
            <div class="flex flex-row gap-4">
                <div class="w-9 h-9 border-4 flex items-center justify-center border-primary rounded-full font-black text-xl">
                    2
                </div>
                <p class="text-3xl font-bold">
                    Fill up your contacts
                </p>
            </div>
            <div class="mt-14 w-full flex flex-col gap-8">
                <input type="text" placeholder="Country of citizenship"
                       class="block border border-neutral-200 px-3 py-4 w-full box-border">
                <input type="text" placeholder="Country of citizenship"
                       class="block border border-neutral-200 px-3 py-4 w-full box-border">
                <input type="text" placeholder="Country of citizenship"
                       class="block border border-neutral-200 px-3 py-4 w-full box-border">
            </div>
        </div>
        <div class="flex flex-row justify-start items-start gap-10">
            <p class="text-xl">
                Understand valuable products and find opportunities for grow by detalized start-up reviews
            </p>
            <button class="border-2 border-primary rounded-lg px-3 py-2.5 text-primary font-semibold hover:bg-primary hover:text-white">
                Checkout
            </button>
        </div>
    </div>
</div>
