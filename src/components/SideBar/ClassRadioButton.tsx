import {
  Box,
  useRadio,
  type UseRadioProps,
  type BoxProps,
} from "@chakra-ui/react";
import { useEffect } from "react";

interface Class {
  className: string;
}

interface ClassRadioButtonProps
  extends Omit<UseRadioProps, "onChange">,
    BoxProps {
  classObject: Class;
  setCurrentClass: React.Dispatch<React.SetStateAction<Class | undefined>>;
}

const ClassRadioButton = ({
  classObject,
  setCurrentClass,
  ...props
}: ClassRadioButtonProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  const handleClick = () => {
    setCurrentClass(classObject);
  };

  return (
    <Box as="label" w="100%">
      <input {...input} onClick={handleClick} />
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
