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

import React from "react";
import ClassRadioButton from "./ClassRadioButton";

interface Class {
  className: string;
}

const Sidebar = ({ classes }: { classes: Class[] }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getRadioProps } = useRadioGroup({
    name: "classList",
    defaultValue: classes[0]?.className,
    onChange: console.log,
  });

  return (
    <Box w="20%">
      <Heading>ActivCard</Heading>
      <VStack spacing={0}>
        {classes.map((c) => {
          const radio = getRadioProps({ value: c.className });
          return (
            <ClassRadioButton key={c.className} {...radio} m={0} p={0}>
              {c.className}
            </ClassRadioButton>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
