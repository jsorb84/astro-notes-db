/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			colors: {
				discord: {
					100: "#7289da",
					200: "#677bc4",
					300: "#5b6eaf",
					400: "#4f609a",
					500: "#445285",
					600: "#384470",
					700: "#2c365b",
					800: "#202946",
				},
			},
		},
	},
	plugins: [],
};
