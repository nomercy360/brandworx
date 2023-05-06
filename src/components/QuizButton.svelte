<!-- QuizButton.svelte -->
<script>
    export let title;
    export let description;

    let isOpen = false;

    function toggleDescription() {
        isOpen = !isOpen;
    }
</script>

<div class="bg-secondary md:px-5 px-4 py-4 flex flex-col cursor-pointer rounded-xl" on:click={toggleDescription}>
    <div class="flex flex-row items-center justify-between">
        <p class="md:text-3xl text-xl">{title}</p>
        <img src={isOpen ? "/arrow-up.svg" : "/arrow-down.svg"} alt="arrow" class="md:w-4 md:h-4 h-3 w-3"/>
    </div>
    {#if isOpen}
        <div class="md:text-2xl mt-10">
            {description}
        </div>
    {/if}
</div>

