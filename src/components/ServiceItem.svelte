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
        class="flex flex-row items-center justify-between w-full"
        on:click={handleClick}
>
    <div class="flex flex-col items-start w-3/5">
        <p class="text-xl font-bold">
            {title}
        </p>
        <p class="opacity-60">
            {description}
        </p>
    </div>
    <div class="flex flex-row items-center gap-2">
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
