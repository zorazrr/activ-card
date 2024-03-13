import {
  VStack,
  useRadioGroup,
  Heading,
  Box,
  HStack,
  Text,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, type Dispatch, type SetStateAction } from "react";
import ClassRadioButton from "./ClassRadioButton";
import { Role, type Classroom } from "@prisma/client";
import { AddIcon } from "@chakra-ui/icons";

const Sidebar = ({
  classes,
  setCurrentClass,
  currentClass,
  onAddClass,
  isLoading,
  accountType,
}: {
  classes: Classroom[];
  currentClass: Classroom;
  setCurrentClass: Dispatch<SetStateAction<Classroom | null>>;
  onAddClass: () => void;
  isLoading: boolean;
  accountType: Role | undefined;
}) => {
  const { getRadioProps } = useRadioGroup({
    name: "classList",
    defaultValue: currentClass ? currentClass.id : "",
    onChange: (nextValue) => {},
  });

  useEffect(() => {
    if (currentClass) {
      const radioProps = getRadioProps({ value: currentClass.id });
      radioProps.onChange(currentClass.id);
    }
  }, [currentClass, getRadioProps]);

  return (
    <Box
      w="20%"
      h="100%"
      className="main-class bg-darkBlue"
      position="sticky"
      top="0"
      zIndex="sticky"
      display="flex-col"
      alignItems="center"
      justifyContent={"center"}
    >
      <HStack px={2} gap={0}>
        <div className="py-6 pl-2 hover:opacity-75">
          <Link href="/dashboard" className="flex flex-col 2xl:flex-row">
            <Image src="/assets/logo.png" alt="header" width={65} height={65} />
            <Heading className="main-class text-white">ActiveCard</Heading>
          </Link>
        </div>
      </HStack>
      {isLoading ? (
        <div
          style={{
            marginLeft: "50%",
            marginRight: "50%",
            marginTop: "100%",
            marginBottom: "100%",
          }}
        >
          <Spinner color={"white"} />
        </div>
      ) : classes.length ? (
        <VStack gap={0}>
          {classes.map((c) => {
            const radio = getRadioProps({ value: c.id });
            return (
              <ClassRadioButton
                key={c.name}
                {...radio}
                setCurrentClass={setCurrentClass}
                classObject={c}
              >
                {c.name}
              </ClassRadioButton>
            );
          })}
          <IconButton
            variant="outline"
            color="white"
            aria-label="Add card"
            icon={<AddIcon />}
            onClick={onAddClass}
            mt={"1vh"}
            _hover={{ bg: "blue.200", borderColor: "blue.200" }}
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
            onClick={onAddClass}
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
