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
                'light-purple': '#A9ADFB',
                'light-pink': '#FCC6FA',
                'green': '#AFF69D',
                'gray': '#5A5A5A',
                'light-orange': '#FBA271',
                'yellow': '#FFC617',
                'pink': '#FCC6FA',
                'orange': '#FB5521',
                'brown': '#EAFC82',
                'purple': '#A9ADFB',
                'whispering-breeze': '#F5FDE5',
                'light-black': '#202020',
                'red': '#DD1F1F',
                'light-red': '#FF9090',
                'light-gray': '#EBEFEE',
                'blue': '#97D7FB',
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
            },
            fontSize: {
                'l': '24px',
                'm': '20px',
                's': '16px',
                'title': '72px',
                'title-mobile': '40px',
                'subtitle': '40px',
                'subtitle-mobile': '32px',
            },
            lineHeight: {
                'l': '36px',
                'm': '32px',
                's': '24px',
                'title': '88px',
                'title-mobile': '48px',
                'subtitle': '48px',
                'subtitle-mobile': '36px',
            },
        },
    },
    variants: {},
    plugins: [],
}

