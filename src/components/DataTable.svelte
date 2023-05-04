<!-- DataTable.svelte -->
<script>
    export let data = [];
    export let headers = [];
</script>

<div class="overflow-x-auto w-full">
    <table class="min-w-full divide-y divide-gray-200 shadow">
        <thead class="bg-gray-50">
        <tr>
            {#each headers as header}
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                </th>
            {/each}
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        {#each data as row (row.id)}
            <tr>
                {#each Object.values(row) as cell}
                    <td class="px-6 py-4 whitespace-nowrap">
                        {cell}
                    </td>
                {/each}
            </tr>
        {/each}
        </tbody>
    </table>
</div>
