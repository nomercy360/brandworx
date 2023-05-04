<script>
    export let name = '';
    export let social = '';
    export let email = '';
    export let zone = '';
</script>
<div class="w-full">
    <input type="text" placeholder="Name" id="name" class="input-item" bind:value={name}>
    <label class="input-label" for="name">
        So we know how to call you
    </label>
    <input type="text" placeholder="Social link" id="social" class="input-item" bind:value={social}>
    <label class="input-label" for="social">
        Telegram, WhatsApp, or Instagram, so we can dm you
    </label>
    <input type="email" placeholder="E-mail" id="email" class="input-item" bind:value={email}>
    <label class="input-label" for="email">
        So our work will be legit
    </label>
    <input type="text" placeholder="Time Zone" id="zone" class="input-item" bind:value={zone}>
    <label class="input-label" for="zone">
        So whe don’t borrow you at night
    </label>
</div>

<style>
    .input-item {
        @apply block border border-neutral-200 px-3 py-4 w-full box-border;
    }

    .input-label {
        @apply font-medium text-xs opacity-40 mt-1 mb-3;
    }
</style>