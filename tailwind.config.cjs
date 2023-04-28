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
				'green': '#38FE4C',
				'gray': '#5A5A5A',
				'yellow': '#FEF038',
				'pink': '#D012A6',
				'orange': '#FB5521',
				'whispering-breeze': '#F5FDE5',
			},
			textColor: {
				'primary': '#000000',
				'secondary': '#FFFFFF',
			},
			borderColor: {
				'secondary': '#FFFFFF',
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

