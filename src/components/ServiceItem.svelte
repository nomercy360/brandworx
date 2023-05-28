<script>
    import {createEventDispatcher} from 'svelte';

    export let id;
    export let title;
    export let description;
    export let price;
    export let selected;
    export let icon;

    export let time;

    export let bgColor;

    const dispatch = createEventDispatcher();

    function handleClick() {
        selected = !selected;
        dispatch('toggleService', {id, price, selected});
    }

    let color;

    $: color = selected ? bgColor : 'bg-neutral-200';
</script>

<div
        class={`flex flex-col items-center justify-between rounded-3xl w-full p-5 md:h-[280px] cursor-pointer h-full ${color} transition-all duration-300`}
        on:click={handleClick}
        on:mouseenter={() => color = bgColor}
        on:mouseleave={() => color = selected ? bgColor : 'bg-neutral-200'}
>
    <div class="flex flex-col items-start">
        <img src={`/${icon}.svg`} alt="Logo" width="50" height="50"/>
        <p class="md:text-xl text-base font-bold mb-1 md:mt-0 mt-3">
            {title}
        </p>
        <p class="opacity-60">
            {description}
        </p>
    </div>
    <div class="flex flex-row items-center justify-between w-full md:mt-0 mt-6">
        <div>
            <p class="text-xl font-bold">
                {price ? `$${price}` : 'Individual'}
            </p>
            <p class="opacity-60">
                {time ? time : ''}
            </p>
        </div>
        <div
                class='bg-opacity-0 md:bg-opacity-10 bg-primary flex flex-row gap-9 md:gap-0 rounded-full px-3 py-3 justify-end items-center md:w-[180px] w-full'
        >
            {#if selected}
                <span class="text-primary font-bold md:block hidden flex-grow whitespace-nowrap">Added</span>
            {:else}
                <span class="text-primary font-bold md:block hidden flex-grow whitespace-nowrap">Add to order</span>
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
