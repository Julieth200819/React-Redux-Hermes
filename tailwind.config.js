/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      backgroundImage: {
        // Elimina los degradados radial y cónico
        "gradient-radial": "none",
        "gradient-conic": "none",
      },
      colors: {
        'custom-blue': '#00324D',
        'custom-blues': '#39A900',
        'sena-red': '#dc2626',
        'narvy-blue': 'rgba(0, 95, 139, 0.5)',
        'darkBlue' : '#00314D',
        'Rblue': '#00314D',
        'Rblue-Trs': 'rgba(0, 49, 77, 0.4)',
        'green' : '#449D44',
        'sena-green' : '#007D78',
        'custom-green': '#3a713a',
        'alert-green': '#BBF7D0',
        'diana':'rgba(57, 169, 0, 0.5)',
        'background-default': '#FFFFFF',
      },
    },
  },
  plugins: [],
};
