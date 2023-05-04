<script>
    export let commissionPercentage = 0;
    export let promoCodeDiscount = 0;
    export let totalPrice = 0;
</script>


<div class="flex flex-row justify-between items-center mt-3 border border-neutral-200 px-3 py-1.5 w-full box-border">
    <input type="text" placeholder="Promo-code" id="promo" class="w-full focus:outline-none">
    <button class="font-bold bg-light-gray-2 rounded-xl px-4 py-3">
        Use
    </button>
</div>
<div class="w-full flex flex-row justify-between items-center mt-4">
    <p>Payment provider commission</p>
    <p>{commissionPercentage}%</p>
</div>
<div class="w-full flex flex-row justify-between items-center mt-4">
    <p>Promo-code</p>
    <p>-{promoCodeDiscount}%</p>
</div>
<div class="bg-primary h-[1px] w-full my-4"></div>
<div class="w-full flex flex-row justify-between items-center">
    <p class="font-bold">Total</p>
    <p class="font-bold total-price-item">${totalPrice}</p>
</div>