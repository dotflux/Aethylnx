/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      "animation": {
    "text-gradient": "text-gradient 1.5s linear infinite",
    "fall": 'fall 1s ease-out',
    "fadeIn": 'fadeIn 1.5s ease-in',
    "glow": 'glow 1.5s infinite ease-in-out',
    "textHover": 'textHover 0.5s ease-in-out forwards',
  },
  "keyframes": {
    "text-gradient": {
      "to": {
        "backgroundPosition": "200% center"
      }
    },
    "fall": {
      '0%': { transform: 'translateY(-100%)', opacity: '0' },
      '100%': { transform: 'translateY(0)', opacity: '1' },
    },
    "fadeIn": {
      '0%': { opacity: '0' },
      '100%': { opacity: '1' },
    },
    "glow": {
      '0%, 100%': { boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)' },
      '50%': { boxShadow: '0 0 30px rgba(255, 255, 255, 1)' },
    },
    textHover: {
      '0%': {
        transform: 'scale(1)',
        color: '#ffffff', // Default color
      },
      '50%': {
        transform: 'scale(1.05)', // Scale up
        color: '#00bcd4', // Hover color
      },
      '100%': {
        transform: 'scale(1)',
        color: '#ffffff', // Back to default color
      },
    },
  },
  fontFamily:{
    'gilroyH':['Gilroy Heavy','sans-serif'],
    'passion1B':['PassionOne Black','sans-serif'],
    'passion1R':['PassionOne Regular','sans-serif']
  },
  backdropBlur:{
    'lg':'10px'
  }
    },
  },
  plugins: [],
  

}

