module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6277f2",
        "primary-light-bg": "white",
        "primary-dark-bg": "#1c1f2a",
        "message-dark-bg": "#2e3545",
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
