/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
  'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    {
        pattern: /grid-cols-./,
        variants:['xl','xl:']
    },
    {
      pattern: /grid-rows-./,
      variants:['xl','xl:']
  }
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui")
  ],
}

