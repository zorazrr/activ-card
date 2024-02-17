import {
  Box,
  useRadio,
  type UseRadioProps,
  type BoxProps,
} from "@chakra-ui/react";

const ClassRadioButton = (props: UseRadioProps & BoxProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label" w="100%">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderBottom="1px gray"
        color="white"
        h="100%"
        _checked={{
          bg: "#4A729D",
          color: "white",
          borderColor: "teal.600",
        }}
        _focus={{
          border: "1px white",
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export default ClassRadioButton;
