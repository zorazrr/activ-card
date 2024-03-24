import React, { useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  HStack,
  IconButton,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import { Role, type Set } from "@prisma/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { type UseTRPCMutationResult } from "@trpc/react-query/shared";
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
  numCards: number;
  accountType: Role | undefined;
}

const SetCard = (props: SetCardProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const onCardClick = () => {
    router.push(`/set/${props.id}`);
  };

  const onEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    window.location.href = `/create/set/${props.id}?isEdit=true`;
  };

  return (
    <Card
      p={3}
      borderRadius="10"
      onClick={onCardClick}
      backgroundColor="mediumBlue.500"
      color="white"
      style={{ cursor: "pointer" }}
      marginRight={5}
      marginTop={5}
      sx={{
        transition: "filter 0.1s",
        "&:hover": {
          filter: "brightness(110%)",
          "& .tag-no-brightness-change": {
            filter: "brightness(90%)",
          },
        },
      }}
    >
      <CardBody h="100%" paddingY={0} paddingRight={0}>
        <HStack h="25vh" w="41vh">
          <Box
            minH="100%"
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"space-between"}
          >
            <Box
              minH="100%"
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <div style={{ paddingBottom: "2vh" }}>
                <p className="h4-5">{props.name}</p>
                {/* {props.description && (
                  <p className="reg-text pt-3">{props.description}</p>
                )} */}
              </div>
              <div>
                <Tag
                  size={"sm"}
                  width="8vh"
                  p={2}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    backgroundColor: "#BEDDFC",
                  }}
                  colorScheme="telegram"
                  className="tag-no-brightness-change"
                  sx={{
                    transition: "filter 0.1s",
                    "&:hover": {
                      filter: "brightness(100%)",
                    },
                  }}
                >
                  {`${props.numCards} Cards`}
                </Tag>
              </div>
            </Box>
            {props.accountType && props.accountType == Role.TEACHER && (
              <HStack mb={"1vh"}>
                <IconButton
                  variant="outline"
                  aria-label="Edit card"
                  backgroundColor={"white"}
                  icon={<EditIcon color="blue.900" />}
                  sx={{
                    transition: "filter 0.1s",
                    "&:hover": {
                      filter: "brightness(200%)",
                    },
                  }}
                  onClick={onEdit}
                />

                <IconButton
                  variant="outline"
                  aria-label="Delete card"
                  backgroundColor={"white"}
                  icon={<DeleteIcon color="blue.900" />}
                  sx={{
                    transition: "filter 0.1s",
                    "&:hover": {
                      filter: "brightness(200%)",
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpen();
                  }}
                />
              </HStack>
            )}
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
                  Delete Set
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
