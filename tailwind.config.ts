import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    colors: {
      ...colors,
      greyborder: "#1c1f26",
      greybg: "#282a36",
      white: "#ffffff",
      twitter: {
        DEFAULT: "#1da1f2",
        disabled: "#0e4e78 ",
        hover: "#1a91da",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
