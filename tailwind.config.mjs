/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'brand-bg': '#f3f6f9',
				'brand-main': '#4f4d4d',
				'brand-accent': '#829240',
			},
			fontFamily: {
				sans: ['Poppins', 'sans-serif'],
				heading: ['Raleway', 'sans-serif'],
			},
			boxShadow: {
				soft: '0 14px 50px -22px rgb(79 77 77 / 0.24)',
			},
			transitionTimingFunction: {
				smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
			},
		},
	},
	plugins: [],
};