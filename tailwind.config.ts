import { Progress } from "@chakra-ui/react";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        roboto: ["Roboto", "sans-serif"],
      },
      minHeight: {
        screen: "100vh",
      },
      fontSize: {
        "h1-size": "96px", // Existing custom font size
        "h2-size": "64px", // New custom font size
        "h3-size": "48px",
        "h4-size": "36px",
        "h5-size": "24px",
        "text-size": "16px",
      },
      fontWeight: {
        extrabold: "900", // Ensure extrabold is correctly mapped if not already
        semibold: "600",
        medium: "400",
      },
      colors: {
        darkBlue: "#1A3F67",
        mediumBlue: "#4A729D",
        midBlue: "#88ADD5",
        lightBlue: "#BEDDFC",
        black: "#000000",
        white: "#FFFFFF",
        lightGray: "#EBEBEB",
        darkGray: "#BDBDBD",
      },
    },
  },
  plugins: [],
} satisfies Config;
