import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  useDisclosure,
  VStack,
  useRadioGroup,
  Heading,
  Box,
} from "@chakra-ui/react";

import React, { type Dispatch, type SetStateAction } from "react";
import ClassRadioButton from "./ClassRadioButton";

interface Class {
  className: string;
}

const Sidebar = ({
  classes,
  setCurrentClass,
}: {
  classes: Class[];
  setCurrentClass: Dispatch<SetStateAction<Class | undefined>>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getRadioProps } = useRadioGroup({
    name: "classList",
    defaultValue: classes[0]?.className,
    onChange: (nextValue) => {
      console.log("Selected class:", nextValue);
    },
  });

  return (
    <Box
      w="20%"
      h="100%"
      className="main-class bg-darkBlue"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      <Heading textAlign="center" mt={3} className="main-class text-white">
        ActivCard
      </Heading>
      <VStack spacing={0}>
        {classes.map((c) => {
          const radio = getRadioProps({ value: c.className });
          return (
            <ClassRadioButton
              key={c.className}
              {...radio}
              gap={0}
              setCurrentClass={setCurrentClass}
              classObject={c}
            >
              {c.className}
            </ClassRadioButton>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
