// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5', // Botões e links principais
        'primary-dark': '#4338ca', // Hover de botões
      },
    },
  },
  plugins: [],
}
