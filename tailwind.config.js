/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        screens: {
            sm: '640px',
            // => @media (min-width: 640px) { ... }

            md: '768px',
            // => @media (min-width: 768px) { ... }

            lg: '1024px',
            // => @media (min-width: 1024px) { ... }

            xl: '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            // => @media (min-width: 1536px) { ... }
        },
        extend: {
            fontFamily: {
                bungee: ["'Bungee Spice'", 'cursive'],
                nunito: ['Nunito', 'sans-serif'],
            },
            boxShadow: {
                search: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
            },
        },
    },
    plugins: [],
};
