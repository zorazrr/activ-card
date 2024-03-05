import React, { useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  HStack,
  IconButton,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import { type Set } from "@prisma/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { UseTRPCMutationResult } from "@trpc/react-query/shared";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";

interface SetCardProps extends Partial<Set> {
  deleteSet: UseTRPCMutationResult<any, any, any, any>;
}

const SetCard = (props: SetCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCardClick = () => {
    router.push(`/set/${props.id}`);
  };
  return (
    <Card
      onClick={onCardClick}
      style={{ cursor: "pointer" }}
      // _hover={{ transform: "scale(1.05)", boxShadow: "lg" }}
      marginRight={5}
      sx={{
        transition: "filter 0.1s",
        "&:hover": {
          filter: "brightness(95%)",
        },
      }} // TODO: which of these two styling methods?
    >
      <CardBody h="100%" paddingY={0} paddingRight={0}>
        <HStack h="25vh" w="40vh">
          <Box
            w="120%"
            minH="100%"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-around"}
          >
            <p className="h4">{props.name}</p>
            <Divider w="100px" />
            {props.description && (
              <p className="reg-text pt-3">{props.description}</p>
            )}
            <HStack mt="8px">
              <IconButton
                variant="outline"
                aria-label="Delete card"
                bg={"gray.200"}
                icon={<EditIcon color="blue.900" />}
                _hover={{ bg: "gray.300", borderColor: "gray.300" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />

              <IconButton
                variant="outline"
                aria-label="Delete card"
                bg={"gray.200"}
                icon={<DeleteIcon color="blue.900" />}
                _hover={{ bg: "gray.300", borderColor: "gray.300" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              />
            </HStack>
          </Box>
          <Box w="20%">
            <Image
              src={`https://picsum.photos/seed/${props.name}/400/400`}
              alt="Set cover image"
              objectFit="cover"
              w="100%"
              h="25vh"
              borderTopRightRadius="md"
              borderBottomRightRadius="md"
            />
          </Box>
          <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent
                backgroundColor={"white"}
                style={{ margin: "auto" }}
              >
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Delete Customer
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure? You can't undo this action afterwards.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button ref={cancelRef} onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() =>
                      props?.deleteSet?.mutate({ setId: props.id })
                    }
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default SetCard;
