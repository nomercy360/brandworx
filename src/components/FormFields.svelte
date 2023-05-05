<script>
    export let name = '';
    export let social = '';
    export let email = '';
    export let zone = '';

    export let nameError = '';
    export let socialError = '';
    export let emailError = '';
    export let zoneError = '';

</script>

<div class="w-full">
    <input type="text" placeholder="Name" id="name" class="input-item" bind:value={name} class:input-error={nameError}>
    <label class="input-label" for="name">So we know how to call you</label>
    {#if nameError}<p class="error-message">{nameError}</p>{/if}

    <input type="text" placeholder="Social link" id="social" class="input-item" bind:value={social}
           class:input-error={socialError}>
    <label class="input-label" for="social">Telegram, WhatsApp, or Instagram, so we can dm you</label>
    {#if socialError}<p class="error-message">{socialError}</p>{/if}

    <input type="email" placeholder="E-mail" id="email" class="input-item" bind:value={email}
           class:input-error={emailError}>
    <label class="input-label" for="email">So our work will be legit</label>
    {#if emailError}<p class="error-message">{emailError}</p>{/if}

    <input type="text" placeholder="Time Zone" id="zone" class="input-item" bind:value={zone}
           class:input-error={zoneError}>
    <label class="input-label" for="zone">So we don’t borrow you at night</label>
    {#if zoneError}<p class="error-message">{zoneError}</p>{/if}
</div>

<style>
    .input-item {
        @apply block border border-neutral-200 px-3 py-4 w-full box-border;
    }

    .input-label {
        @apply font-medium text-xs opacity-40 mt-1 mb-3;
    }

    .input-error {
        @apply border-red-400;
    }

    .error-message {
        @apply text-xs text-red-400 font-medium mt-1 mb-3;
    }
</style>
