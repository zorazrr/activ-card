import {
  Box,
  useRadio,
  type UseRadioProps,
  type BoxProps,
} from "@chakra-ui/react";
import { type Classroom } from "@prisma/client";

interface ClassRadioButtonProps
  extends Omit<UseRadioProps, "onChange">,
    BoxProps {
  classObject: Classroom;
  setCurrentClass: React.Dispatch<React.SetStateAction<Classroom | undefined>>;
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
        color="white"
        h="100%"
        _checked={{
          bg: "#4A729D",
          color: "white",
          borderBottom: "0.1vh solid #1A3F67",
          borderRight: "0.125vh solid #1A3F67",
        }}
        _hover={{
          bg: "#4A729D",
          color: "white",
          borderBottom: "0.1vh solid #1A3F67",
          borderRight: "0.125vh solid #1A3F67",
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
