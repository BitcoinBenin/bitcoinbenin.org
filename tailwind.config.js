/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Premium Futuristic Palette
        brand: {
          dark: '#020617',    // Deep Indigo/Slate Dark
          charcoal: '#0F172A', // Lighter Dark for cards
          green: '#008850',   // Bitcoin Green (from logo)
          accent: '#00A67E',  // Lighter green for hover
          'green-dark': '#006B40', // Darker green for accents
          electric: '#00D9FF', // Electric blue accent
          purple: '#8B5CF6',   // Purple accent for variety
          glass: 'rgba(2, 6, 23, 0.7)', // For glassmorphism
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],        
        display: ['Space Grotesk', 'Outfit', 'sans-serif'],    
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'premium-gradient': 'linear-gradient(to bottom right, #020617, #0F172A)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow': '0 0 20px -5px rgba(0, 136, 80, 0.3)',
        'glow-hover': '0 0 30px -5px rgba(0, 136, 80, 0.5)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.8s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
