<script>
    export let commissionPercentage = 0;
    export let promoCodeDiscount = 0;
    export let totalPrice = 0;

    let inputValue = '';
    let errorMessage = '';

    async function applyPromoCode() {
        if (inputValue === '') {
            return;
        }

        const response = await fetch(`/api/promo/${inputValue}`)

        if (response.status === 200) {
            const data = await response.json();
            promoCodeDiscount = data.discount;
            errorMessage = '';
        } else {
            errorMessage = 'Invalid promo code';
        }
    }
</script>

<div class="flex flex-row justify-between items-center mt-3 border border-neutral-200 w-full box-border py-1.5">
    <input type="text" placeholder="Promo-code" id="promo" class="w-full focus:outline-none h-10 ml-3"
           bind:value={inputValue}/>
    <button class="font-bold bg-primary text-secondary rounded-xl px-4 py-2.5 mr-3 transition-colors duration-500 ease-in-out"
            id="use-promo"
            class:disabled={inputValue === ''}
            on:click={applyPromoCode}>
        Use
    </button>
</div>
<p class="text-red-500">{errorMessage}</p>
<div class="w-full flex flex-row justify-between items-center mt-4">
    <p>Payment provider commission</p>
    <p>{commissionPercentage}%</p>
</div>
{#if promoCodeDiscount > 0}
    <div class="w-full flex flex-row justify-between items-center mt-4">
        <p>Promo-code</p>
        <p>-{promoCodeDiscount}%</p>
    </div>
{/if}
<div class="bg-primary h-[1px] w-full my-4"></div>
<div class="w-full flex flex-row justify-between items-center">
    <p class="font-bold">Total</p>
    <p class="font-bold total-price-item">${totalPrice}</p>
</div>

<style>
    #use-promo.disabled {
        @apply bg-light-gray-2 text-neutral-200 cursor-not-allowed;
    }
</style>
