import {
  VStack,
  useRadioGroup,
  Heading,
  Box,
  HStack,
  Text,
  IconButton,
  Spinner,
  Divider,
  Image as ChakImage,
} from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";

import React, { useEffect, type Dispatch, type SetStateAction } from "react";
import ClassRadioButton from "./ClassRadioButton";
import { Role, type Classroom } from "@prisma/client";
import { AddIcon } from "@chakra-ui/icons";
import StyledButton from "../Button";
import { signOut, useSession } from "next-auth/react";

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
  const { data: session } = useSession();
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
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <HStack px={2} gap={0}>
          <div className="py-6 pl-2 hover:opacity-75">
            <Link href="/dashboard" className="flex flex-col 2xl:flex-row">
              <Image
                src="/assets/logo.png"
                alt="header"
                width={65}
                height={65}
              />
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
          <VStack gap={0} overflowY="scroll" overflowX="hidden" height="80vh">
            <div className=" w-full">
              <Divider mb={2} />
              <div
                className="main-class w-full text-h5-size font-semibold text-white"
                style={{ marginLeft: "1.25rem" }}
              >
                Classes
              </div>
              <Divider mt={2} />
            </div>
            {classes.map((c) => {
              const radio = getRadioProps({ value: c.id });
              return (
                <ClassRadioButton
                  key={c.id}
                  {...radio}
                  setCurrentClass={setCurrentClass}
                  classObject={c}
                >
                  {c.name}
                </ClassRadioButton>
              );
            })}
            <IconButton
              pl={2}
              pr={2}
              pb={2.5}
              pt={2.5}
              mt={"2vh"}
              variant="outline"
              color="white"
              aria-label="Add card"
              icon={<AddIcon color="white" />}
              _hover={{ bg: "midBlue.500", borderColor: "midBlue.500" }}
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
              _hover={{ bg: "midBlue.500", borderColor: "midBlue.500" }}
              onClick={onAddClass}
            />
            <Text className={"h5"} color="white">
              {accountType && accountType == Role.STUDENT && "Join Class"}
              {accountType && accountType == Role.TEACHER && "Add Class"}
            </Text>
          </VStack>
        )}
      </Box>

      <HStack alignItems={"center"} mb={3} ml={"1.25rem"}>
        {session?.user.image && (
          <ChakImage
            borderRadius="full"
            src={session?.user.image}
            alt="Propics"
            width={10}
          />
        )}
        <Box
          cursor="pointer"
          color="white"
          outline={"white"}
          opacity="100%"
          // border="0.15vh solid white"
          _hover={{
            bg: "white",
            color: "black",
          }}
          px={5}
          py={3}
          textAlign="center"
          borderRadius={15}
        >
          <button
            className="reg-text"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </button>
        </Box>
      </HStack>
    </Box>
  );
};

export default Sidebar;
