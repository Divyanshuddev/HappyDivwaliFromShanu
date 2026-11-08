/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        diwali: {
          gold: "#FFD700",
          amber: "#FFBF00",
          orange: "#FF7800",
          maroon: "#800020",
          deepPurple: "#12072B",
          night: "#0a0518"
        }
      },
      animation: {
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'diya-flame': 'flameWobble 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        sparkle: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.9' },
          '50%': { transform: 'scale(1.2) rotate(15deg)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 15px rgba(255, 180, 0, 0.7))' },
          '50%': { filter: 'drop-shadow(0 0 35px rgba(255, 80, 0, 0.95))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flameWobble: {
          '0%': { transform: 'scale(1) skewX(-2deg)' },
          '50%': { transform: 'scale(1.08, 0.95) skewX(2deg)' },
          '100%': { transform: 'scale(0.96, 1.05) skewX(-1deg)' },
        }
      }
    },
  },
  plugins: [],
}

