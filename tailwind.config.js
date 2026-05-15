/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'issetdarkmode',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        Jexbg: "#2196f3",
		primary: 'rgb(var(--group-theme) / <alpha-value>)',
      },
	  backgroundImage: {
		infobg: "url('/Jexbackground.svg')"
	  }
    },
    
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],

};
