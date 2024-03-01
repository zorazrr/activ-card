import {
  VStack,
  useRadioGroup,
  Heading,
  Box,
  HStack,
  Text,
  IconButton,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import React, { type Dispatch, type SetStateAction } from "react";
import ClassRadioButton from "./ClassRadioButton";
import { type Classroom } from "@prisma/client";
import { AddIcon } from "@chakra-ui/icons";

const Sidebar = ({
  classes,
  setCurrentClass,
  onAddClass,
}: {
  classes: Classroom[];
  setCurrentClass: Dispatch<SetStateAction<Classroom | null>>;
  onAddClass: () => void;
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
        <div className="py-6 pl-2 hover:opacity-75">
          <Link href="/dashboard" className="flex flex-col 2xl:flex-row">
            <Image src="/assets/logo.png" alt="header" width={65} height={65} />
            <Heading className="main-class text-white">ActiveCard</Heading>
          </Link>
        </div>
      </HStack>

      {classes.length ? (
        <VStack>
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
          <IconButton
            variant="outline"
            colorScheme="cyan"
            aria-label="Add card"
            size={"xl"}
            icon={<AddIcon />}
            onClick={onAddClass}
          />
        </VStack>
      ) : (
        <VStack
          spacing={4}
          height="70vh"
          align={"center"}
          justifyContent={"center"}
        >
          <IconButton
            variant="outline"
            aria-label="Add card"
            fontSize="20px"
            icon={<AddIcon color="white" />} // Apply color directly to the icon
            _hover={{ bg: "blue.200", borderColor: "blue.200" }}
          />
          <Text className={"h5"} color="white">
            Add Class
          </Text>
        </VStack>
      )}
    </Box>
  );
};

export default Sidebar;
