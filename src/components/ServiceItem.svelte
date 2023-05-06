<script>
    import {createEventDispatcher} from 'svelte';

    export let id;
    export let title;
    export let description;
    export let price;
    export let selected;
    export let icon;

    export let bgColor;

    const dispatch = createEventDispatcher();

    function handleClick() {
        selected = !selected;
        dispatch('toggleService', {id, price, selected});
    }
</script>

<div
        class={`flex flex-col items-center justify-between rounded-3xl w-full p-5 md:h-[280px] h-full ${selected ? bgColor : 'bg-neutral-200'}`}
        on:click={handleClick}
>
    <div class="flex flex-col items-start">
        <img src={`/${icon}.svg`} alt="Logo" width="50" height="50"/>
        <p class="md:text-xl text-base font-bold mb-1">
            {title}
        </p>
        <p class="opacity-60">
            {description}
        </p>
    </div>
    <div class="flex flex-row items-center justify-between w-full md:mt-0 mt-6">
        <p class="text-xl font-bold">
            ${price}
        </p>
        <div
                class='md:bg-opacity-10 bg-transparent bg-primary flex flex-row gap-9 rounded-lg px-3 py-3 items-center'
        >
            {#if selected}
                <span class="text-primary font-bold md:block hidden">Added to order</span>
            {:else}
                <span class="text-primary font-bold md:block hidden">Add to order</span>
            {/if}
            <span class="w-7 h-7 bg-opacity-20 bg-primary flex items-center justify-center rounded-full">
                {#if selected}
                    <img src="/minus.svg" alt="Check" width="12" height="12"/>
                {:else}
                    <img src="/plus.svg" alt="Plus" width="12" height="12"/>
                {/if}
            </span>
        </div>
    </div>
</div>
