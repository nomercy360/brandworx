/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],

    theme: {
        extend: {
            backgroundColor: {
                'primary': '#000000',
                'secondary': '#FFFFFF',
                'gradient-start': '#6288da',
                'gradient-end': '#e39999',
                'green': '#00D696',
                'gray': '#5A5A5A',
                'yellow': '#FFC617',
                'pink': '#D012A6',
                'orange': '#FB5521',
                'brown': '#E38F41',
                'purple': '#7182EB',
                'whispering-breeze': '#F5FDE5',
                'light-black': '#202020',
                'red': '#DD1F1F',
                'light-red': '#D84B5D',
                'light-gray': '#EBEFEE',
                'blue': '#23C4F8',
                'light-gray-2': '#F8F8F8',
                'steel-blue': '#91A5BA',
            },
            textColor: {
                'primary': '#000000',
                'secondary': '#FFFFFF',
            },
            borderColor: {
                'secondary': '#FFFFFF',
                'yellow': '#FFC617',
                'blue': '#23C4F8',
                'green': '#00D696',
            },
            colors: {
                'primary': '#000000',
                'secondary': '#FFFFFF',
            }
        },
    },
    variants: {},
    plugins: [],
}

