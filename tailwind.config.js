module.exports = {
	mode: 'jit',
	purge: [
		'./public/**/*.html',
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./src/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
	},
	variants: {
		extend: {
			opacity: ['disabled'],
			backgroundColor: ['disabled'],
			cursor: ['disabled'],
		},
	},
	plugins: [require('tailwind-scrollbar-hide')],
};
