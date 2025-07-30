/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        jost: ["Jost"],
        typographica: ["Typographica", "sans-serif"],
        champagne: ["Champagne & Limousines", "sans-serif"],
        futura: ["Futura", "sans-serif"],
      },
      colors: {
        // Paleta Pantone 5757C según terrasacha-design.json
        terrasacha: {
          // Verde Selva - Principal
          primary: {
            DEFAULT: "#6e6c35",
            light: "#7a7842",
            dark: "#5f5f23",
            rgb: "109, 110, 53",
            pantone: "5757C"
          },
          // Verde Bosques Nublados - Secundario 1
          secondary1: {
            DEFAULT: "#44482c",
            light: "#4f5333",
            dark: "#3a3e24",
            rgb: "68, 72, 44",
            pantone: "5743C"
          },
          // Verde Pradera - Secundario 2
          secondary2: {
            DEFAULT: "#849b50",
            light: "#8fa55a",
            dark: "#7a8f46",
            rgb: "132, 155, 80",
            pantone: "576C"
          },
          // Verde Claro - Otros 1
          light: {
            DEFAULT: "#b1c181",
            light: "#bcc78d",
            dark: "#a6b375",
            rgb: "177, 193, 129",
            pantone: "577C"
          },
          // Amarillo Tierra - Otros 2
          earth: {
            DEFAULT: "#e8d79a",
            light: "#eddaa4",
            dark: "#e3d290",
            rgb: "232, 215, 154",
            pantone: "7402C"
          },
          // Colores semánticos basados en la paleta
          success: "#849b50",
          warning: "#e8d79a",
          info: "#b1c181",
          danger: "#dc3545",
        },
        // Mantener compatibilidad con la paleta anterior
        pantone: {
          primary: "#6e6c35",
          secondary1: "#44482c",
          secondary2: "#849b50",
          other1: "#b1c181",
          other2: "#e8d79a",
        }
      },
      spacing: {
        // Sistema de espaciado basado en el diseño
        'xs': '0.25rem',    // 4px
        'sm': '0.5rem',     // 8px
        'md': '1rem',       // 16px
        'lg': '1.5rem',     // 24px
        'xl': '2rem',       // 32px
        '2xl': '3rem',      // 48px
        '3xl': '4rem',      // 64px
        '4xl': '6rem',      // 96px
        '5xl': '8rem',      // 128px
      },
      borderRadius: {
        'xs': '0.125rem',   // 2px
        'sm': '0.25rem',    // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        'full': '9999px',
      },
      boxShadow: {
        'terrasacha': '0 4px 6px rgba(110, 108, 53, 0.1)',
        'terrasacha-lg': '0 8px 16px rgba(110, 108, 53, 0.15)',
        'terrasacha-xl': '0 12px 24px rgba(110, 108, 53, 0.2)',
        'terrasacha-2xl': '0 20px 40px rgba(110, 108, 53, 0.25)',
        'inner-terrasacha': 'inset 0 2px 4px rgba(110, 108, 53, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-terrasacha': 'pulseTerrasacha 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseTerrasacha: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'gradient-terrasacha': 'linear-gradient(135deg, #6e6c35 0%, #849b50 100%)',
        'gradient-terrasacha-subtle': 'linear-gradient(135deg, #e8d79a 0%, #b1c181 100%)',
        'gradient-terrasacha-dark': 'linear-gradient(135deg, #44482c 0%, #6e6c35 100%)',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    // Plugin personalizado para clases de Terrasacha
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-terrasacha-primary': {
          color: theme('colors.terrasacha.primary.DEFAULT'),
        },
        '.text-terrasacha-secondary1': {
          color: theme('colors.terrasacha.secondary1.DEFAULT'),
        },
        '.text-terrasacha-secondary2': {
          color: theme('colors.terrasacha.secondary2.DEFAULT'),
        },
        '.text-terrasacha-light': {
          color: theme('colors.terrasacha.light.DEFAULT'),
        },
        '.text-terrasacha-earth': {
          color: theme('colors.terrasacha.earth.DEFAULT'),
        },
        '.bg-terrasacha-primary': {
          backgroundColor: theme('colors.terrasacha.primary.DEFAULT'),
        },
        '.bg-terrasacha-secondary1': {
          backgroundColor: theme('colors.terrasacha.secondary1.DEFAULT'),
        },
        '.bg-terrasacha-secondary2': {
          backgroundColor: theme('colors.terrasacha.secondary2.DEFAULT'),
        },
        '.bg-terrasacha-light': {
          backgroundColor: theme('colors.terrasacha.light.DEFAULT'),
        },
        '.bg-terrasacha-earth': {
          backgroundColor: theme('colors.terrasacha.earth.DEFAULT'),
        },
        '.border-terrasacha-primary': {
          borderColor: theme('colors.terrasacha.primary.DEFAULT'),
        },
        '.border-terrasacha-secondary1': {
          borderColor: theme('colors.terrasacha.secondary1.DEFAULT'),
        },
        '.border-terrasacha-secondary2': {
          borderColor: theme('colors.terrasacha.secondary2.DEFAULT'),
        },
        '.border-terrasacha-light': {
          borderColor: theme('colors.terrasacha.light.DEFAULT'),
        },
        '.border-terrasacha-earth': {
          borderColor: theme('colors.terrasacha.earth.DEFAULT'),
        },
        '.shadow-terrasacha': {
          boxShadow: theme('boxShadow.terrasacha'),
        },
        '.shadow-terrasacha-lg': {
          boxShadow: theme('boxShadow.terrasacha-lg'),
        },
        '.shadow-terrasacha-xl': {
          boxShadow: theme('boxShadow.terrasacha-xl'),
        },
        '.shadow-terrasacha-2xl': {
          boxShadow: theme('boxShadow.terrasacha-2xl'),
        },
        '.bg-gradient-terrasacha': {
          backgroundImage: theme('backgroundImage.gradient-terrasacha'),
        },
        '.bg-gradient-terrasacha-subtle': {
          backgroundImage: theme('backgroundImage.gradient-terrasacha-subtle'),
        },
        '.bg-gradient-terrasacha-dark': {
          backgroundImage: theme('backgroundImage.gradient-terrasacha-dark'),
        },
        '.font-typographica': {
          fontFamily: theme('fontFamily.typographica'),
        },
        '.font-champagne': {
          fontFamily: theme('fontFamily.champagne'),
        },
        '.font-futura': {
          fontFamily: theme('fontFamily.futura'),
        },
        '.animate-fade-in': {
          animation: theme('animation.fade-in'),
        },
        '.animate-slide-up': {
          animation: theme('animation.slide-up'),
        },
        '.animate-scale-in': {
          animation: theme('animation.scale-in'),
        },
        '.animate-pulse-terrasacha': {
          animation: theme('animation.pulse-terrasacha'),
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
