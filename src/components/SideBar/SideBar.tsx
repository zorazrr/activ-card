import {
  useDisclosure,
  VStack,
  useRadioGroup,
  Heading,
  Box,
  HStack,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

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
      <HStack px={2} gap={0}>
        <div className="py-5 pl-2 hover:opacity-75">
          <Link href="/">
            <Image src="/assets/logo.png" alt="header" width={65} height={65} />
          </Link>
        </div>
        <Heading className="main-class text-white">ActiveCard</Heading>
      </HStack>
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
