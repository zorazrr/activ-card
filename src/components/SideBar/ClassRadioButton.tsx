import {
  Box,
  useRadio,
  type UseRadioProps,
  type BoxProps,
} from "@chakra-ui/react";
import { type Classroom } from "@prisma/client";
import { useRouter } from "next/router";

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
  const router = useRouter();
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  const handleClick = () => {
    setCurrentClass(classObject);
    router.push(`/dashboard?class=${classObject.id}`);
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
          bg: "mediumBlue.500",
          color: "white",
          borderBottom: "0.1vh solid darkBlue.500",
        }}
        _hover={{
          bg: "mediumBlue.500",
          color: "white",
          borderBottom: "0.1vh solid darkBlue.500",
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
