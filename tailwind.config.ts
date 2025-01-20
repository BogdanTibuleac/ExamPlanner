import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },
    colors: {
      lamaSky: "#C3EBFA",
      lamaSkyLight: "#EDF9FD",
      lamaPurple: "#C3EBFA",
      lamaPurpleLight: "#EDF9FD",
      lamaYellow: "#FAE27C",
      lamaYellowLight: "#FEFCE8",
    },
    keyframes: {
      pulse: {
        "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
        "50%": { transform: "scale(1.5)", opacity: "0.2" },
      },
      "color-shift": {
        "0%, 100%": { color: "#FAE27C" }, // Yellow
        "33%": { color: "#C3EBFA" }, // Sky
        "66%": { color: "#C3EBFA" }, // Purple
      },
    },
    animation: {
      pulse: "pulse 1.5s ease-in-out infinite",
      "color-shift": "color-shift 3s linear infinite",
    },
  },
},

  plugins: [],
};
export default config;
