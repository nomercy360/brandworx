<script>
    function logout() {
        window.location.href = '/admin/logout';
    }
</script>

<button
        class="border border-neutral-200 rounded-lg hover:bg-neutral-200 hover:text-neutral-700 px-4 py-2"
        on:click={logout}
>
    Logout
</button>
