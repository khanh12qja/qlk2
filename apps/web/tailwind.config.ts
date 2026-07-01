import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f8f5",
        panel: "#ffffff",
        ink: "#17201b",
        muted: "#647067",
        line: "#d9dfd8",
        steel: "#3f5f6d",
        copper: "#a65f3d",
        pine: "#245440"
      },
      boxShadow: {
        panel: "0 1px 2px rgba(23, 32, 27, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
