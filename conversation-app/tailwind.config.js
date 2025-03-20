/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors for domains
        'atl-reg': {
          100: '#dbeafe',
          800: '#1e40af',
        },
        'sed': {
          100: '#f3e8ff',
          800: '#6b21a8',
        },
        'lld': {
          100: '#dcfce7',
          800: '#166534',
        },
        'cog': {
          100: '#fef9c3',
          800: '#854d0e',
        },
        'pd-hlth': {
          100: '#fee2e2',
          800: '#991b1b',
        },
        'hss': {
          100: '#e0e7ff',
          800: '#3730a3',
        },
        'vpa': {
          100: '#fce7f3',
          800: '#9d174d',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      maxHeight: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
        ],
      },
      boxShadow: {
        'assessment': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      zIndex: {
        '-10': '-10',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.900'),
            h1: {
              color: theme('colors.indigo.600'),
            },
            h2: {
              color: theme('colors.indigo.600'),
            },
            h3: {
              color: theme('colors.indigo.600'),
            },
            strong: {
              color: theme('colors.indigo.600'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}; 