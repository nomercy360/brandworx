<script>
    let username = '';
    let password = '';

    async function submit() {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = '/admin';
        } else {
            alert('Invalid username or password. Please try again.');
        }
    }
</script>


<div class="w-full max-w-xs mx-auto h-screen flex flex-col items-center justify-center">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                Username
            </label>
            <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                   id="username" type="text" placeholder="Username" bind:value={username}>
        </div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                Password
            </label>
            <input class="appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                   id="password" type="password" placeholder="Password" bind:value={password}>
        </div>
        <div class="flex items-center justify-between">
            <button class="bg-primary hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button" on:click={submit}>
                Sign In
            </button>
        </div>
    </form>
</div>
