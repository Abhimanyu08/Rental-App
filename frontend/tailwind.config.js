module.exports = {
	content: [
		"src/pages/**/*.{js,ts,jsx,tsx}",
		"src/components/**/*.{js,ts,jsx,tsx}",
	],
	darkmode: "class",
	theme: {
		extend: {},
	},
	plugins: [require("daisyui")],
};
