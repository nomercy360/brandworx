<script>
    import { createEventDispatcher } from 'svelte';
    export let id;
    export let title;
    export let description;
    export let price;
    export let selected;

    const dispatch = createEventDispatcher();

    function handleClick() {
        selected = !selected;
        dispatch('toggleService', { id, price, selected });
    }
</script>

<div
        class="flex flex-col items-center justify-between w-full bg-light-gray-2 p-5 md:h-[280px] h-full"
        on:click={handleClick}
>
    <div class="flex flex-col items-start">
        <img src="/logo-small.svg" alt="Logo" class="w-8 h-8 mb-2"/>
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
        <img
                src={selected ? '/icon-remove.svg' : '/icon-add.svg'}
                alt={selected ? 'Remove Service' : 'Add Service'}
                class="w-6 h-6"
        />
    </div>
</div>
