import {
  useDisclosure,
  VStack,
  useRadioGroup,
  Heading,
  Box,
} from "@chakra-ui/react";

import React, { type Dispatch, type SetStateAction } from "react";
import ClassRadioButton from "./ClassRadioButton";
import { type Classroom } from "@prisma/client";

const Sidebar = ({
  classes,
  setCurrentClass,
}: {
  classes: Classroom[];
  setCurrentClass: Dispatch<SetStateAction<Classroom | undefined>>;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { getRadioProps } = useRadioGroup({
    name: "classList",
    defaultValue: classes[0]?.name,
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
        ActiveCard
      </Heading>
      <VStack spacing={0}>
        {classes.map((c) => {
          const radio = getRadioProps({ value: c.name });
          return (
            <ClassRadioButton
              key={c.name}
              {...radio}
              gap={0}
              setCurrentClass={setCurrentClass}
              classObject={c}
            >
              {c.name}
            </ClassRadioButton>
          );
        })}
      </VStack>
    </Box>
  );
};

export default Sidebar;
