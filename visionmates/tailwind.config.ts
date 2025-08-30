import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "DotGothic16", "sans-serif"],
        body: ["var(--font-body)", "Noto Sans JP", "sans-serif"],
      },
      colors: {
        wood: "#8B5A2B",
        parchment: "#F5F0E1",
        accent: "#D64545",
        success: "#3AA76D",
        gold: "#FFD700",
      },
    },
  },
};

export default config;

