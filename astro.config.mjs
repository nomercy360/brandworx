import {defineConfig} from 'astro/config';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import robotsTxt from "astro-robots-txt";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: 'https://disrapt.co',
    integrations: [tailwind(), svelte(), robotsTxt(), sitemap({
        filter: (page) => page !== 'https://disrapt.co/admin/',
    })],
});