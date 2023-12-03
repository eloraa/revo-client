/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: "'Arame Mono', monospace",
      },
      colors: {
        'pale': '#ebe8df',
        blue: '#0016ec',
        'dark-white': '#e4e6ef',
        'off-white': '#f0f1fa',
        green: '#c1ff00',
        red: '#ff4c41',
        'rose-main': '#b4042a',
        'white-gray': '#b4b6c6'
      },
      keyframes: {
        glow: {
          '0%, 100%': { filter: 'drop-shadow(0px 0px 0px currentColor)' },
          '50%': { filter: 'drop-shadow(0px 0px 10px currentColor)' },
        },
        '3d-rotate': {
          from: {
            transform: 'perspective(1000px) rotateY(360deg) rotateX(15deg) translateY(-40px)',
          },
          to: {
            transform: 'perspective(1000px) rotateY(0deg) rotateX(15deg) translateY(-40px)',
          },
        },
        dissolve: {
          from: {
            filter: 'blur(0px)',
            opacity: '1',
          },
          to: {
            filter: 'blur(40px)',
            opacity: '0',
          },
        },
        'dissolve-in': {
          from: {
            filter: 'blur(40px)',
            opacity: '0',
          },
          to: {
            filter: 'blur(0px)',
            opacity: '1',
          },
        },
        'in': {
          from: {
            transform: 'translateY(100%)',
            opacity: 0,
          },
          to: {
            transform: 'translateY(0%)',
            opacity: 1,
          },
        },
        'out': {
          from: {
            transform: 'translateY(0%)',
            opacity: 1,
          },
          to: {
            transform: 'translateY(100%)',
            opacity: 0,
          },
        },
      },
      animation: {
        'glow': 'glow 4s ease-in-out infinite',
        '3d-rotate': '3d-rotate 10s linear infinite',
        'dissolve-in': 'dissolve-in 500ms ease',
        'dissolve': 'dissolve 500ms ease forwards',
        'enter': 'in 200ms ease forwards',
        'leave': 'out 200ms ease forwards',
      },
    },
  },
  plugins: [],
};
