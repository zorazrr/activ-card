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
    <Box as="label" w="100%" h="80px">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderBottom="1px gray"
        _checked={{
          bg: "teal.600",
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
