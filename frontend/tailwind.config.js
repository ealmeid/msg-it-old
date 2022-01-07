module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "button-bg": "#6277f2",
      },
      maxWidth: {
        "1/2": "50%",
        "1/2-screen": "50vw",
      },
      height: {
        "1/2-screen": "50vh",
      },
    },
  },
  plugins: [],
};
