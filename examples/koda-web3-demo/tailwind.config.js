/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../packages/koda-core/src/**/*.{js,ts,jsx,tsx}" // Scan Koda Core for classes
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
