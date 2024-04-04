import { extendTheme } from "@chakra-ui/react";
import { tagAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tagAnatomy.keys);

const colors = {
  darkBlue: {
    500: "#1A3F67",
    700: "#17395d",
  },
  mediumBlue: {
    500: "#4A729D",
    700: "#3b5b7e",
  },
  midBlue: {
    500: "#88ADD5",
  },
  lightBlue: {
    500: "#BEDDFC",
  },
  black: {
    500: "#000000",
  },
  white: {
    500: "#FFFFFF",
  },
  lightGray: {
    500: "#EFF2F3",
  },
  darkGray: {
    500: "#BDBDBD",
  },
  lightOrange: {
    500: "#FFA754",
  },
  lightYellow: {
    500: "#FFE561",
  },
  indigo: {
    500: "#621D8C",
  },
};

const baseStyle = definePartsStyle({
  // define the part you're going to style
  container: {
    bg: colors.midBlue[500],
    color: colors.white[500],
  },
});

const tagTheme = defineMultiStyleConfig({ baseStyle });

const theme = extendTheme({
  colors: colors,
  components: {
    Tag: tagTheme,
  },
});

export { theme, tagTheme };
