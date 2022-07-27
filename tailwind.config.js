module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./test/**/*.{js,ts,jsx,tsx}",
		// "./node_modules/flowbite/**/*.js",
	],
	theme: {
		extend: {},
		backdropFilter: {
			none: "none",
			blur: "blur(20px)",
		},
	},
	plugins: [require("tailwindcss-filters")],
};
