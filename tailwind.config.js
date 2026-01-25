module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#b8d7ff",
          300: "#8ebeff",
          400: "#5a97ff",
          500: "#2d6bff",
          600: "#1d4ff2",
          700: "#163dd0",
          800: "#1734a9",
          900: "#172f86"
        },
        ink: {
          50: "#f8fafc",
          100: "#eef2f6",
          200: "#d9e1eb",
          300: "#b6c4d6",
          400: "#7e94ae",
          500: "#556d89",
          600: "#3f546f",
          700: "#2f4058",
          800: "#233246",
          900: "#182636"
        },
        sand: {
          50: "#fff9f1",
          100: "#fff1dd",
          200: "#ffe2b4",
          300: "#ffd48a",
          400: "#ffc260",
          500: "#f8aa2d",
          600: "#d88712",
          700: "#b2660c",
          800: "#8c4e10",
          900: "#6a3a12"
        }
      }
    }
  },
  plugins: []
};
