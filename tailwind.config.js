/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		extend: {
			animation: {
				"pulse-delay1": "pulse 3s linear 0.5s infinite",
				"pulse-delay2": "pulse 3s linear 1s infinite",
				"pulse-delay3": "pulse 3s linear 1.5s infinite",
				"pulse-delay4": "pulse 3s linear 2s infinite",
				"pulse-delay5": "pulse 3s linear 2.5s infinite",
				"pulse-delay6": "pulse 3s linear 3s infinite",
			},
		},
	},
	plugins: [],
};
