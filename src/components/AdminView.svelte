<script>
    import {onMount} from "svelte";
    import DataTable from "./DataTable.svelte";

    let orders = [];
    let promoCodes = [];
    let showOrders = true;

    const fetchOrders = async () => {
        const response = await fetch("/admin/orders");
        if (response.status === 200) {
            return (orders = await response.json());
        } else {
            return (orders = []);
        }
    };

    const fetchPromoCodes = async () => {
        const response = await fetch("/admin/promos");
        if (response.status === 200) {
            return (promoCodes = await response.json());
        } else {
            return (promoCodes = []);
        }
    };

    onMount(async () => {
        await fetchOrders();
        await fetchPromoCodes();
    });
</script>

<main class="px-4 flex flex-row w-full">
    {#if showOrders}
        <DataTable
                data={orders}
                headers={[
        "Name",
        "Social",
        "Email",
        "Zone",
        "Services",
        "Total",
        "Discount",
        "Created At",
      ]}
        />
    {:else}
        <DataTable
                data={promoCodes}
                headers={["Id", "Code", "Discount", "Used", "Created At"]}
        />
    {/if}
    <div class="w-1/4 flex-col flex gap-4 p-4">
        <button
                class="border-2 border-neutral-800 rounded-lg px-4 py-2 w-full switch-button"
                class:active={showOrders}
                on:click={() => (showOrders = true)}
        >
            Orders
        </button>
        <button
                class="border-2 border-neutral-800 rounded-lg px-4 py-2 w-full switch-button"
                class:active={!showOrders}
                on:click={() => (showOrders = false)}
        >
            Promo Codes
        </button>
    </div>
</main>

<style>
    .switch-button.active {
        @apply bg-neutral-800 text-white;
    }
</style>