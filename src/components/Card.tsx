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
import { Role, SetType, type Set } from "@prisma/client";
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
  setType: SetType | undefined;
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
      backgroundColor="white"
      color="darkBlue.500"
      style={{ cursor: "pointer" }}
      marginRight={5}
      marginTop={5}
      sx={{
        transition: "filter 0.1s",
        "&:hover": {
          filter: "brightness(150%)",
          "& .tag-no-brightness-change": {
            filter: "brightness(70%)",
          },
        },
      }}
    >
      <CardBody h="100%" paddingY={0} paddingRight={0}>
        <Box h="25vh" w="22vw">
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
              <div style={{ paddingBottom: "2vh", width: "100%" }}>
                <HStack justifyContent={"space-between"}>
                  <p className="h4-5">{props.name}</p>
                  {props.setType && (
                    <Tag
                      size={"sm"}
                      backgroundColor={"lightBlue.500"}
                      color={"darkBlue.500"}
                      width="10vh"
                      p={2}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        // backgroundColor: getTypeTagColor(props.setType),
                        // backgroundColor: "lightBlue.500",
                        // color: "darkBlue.500",
                      }}
                      className="tag-no-brightness-change"
                      sx={{
                        transition: "filter 0.1s",
                        "&:hover": {
                          filter: "brightness(100%)",
                        },
                      }}
                    >
                      {`${props.setType}`}
                    </Tag>
                  )}
                </HStack>
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
                    // backgroundColor: "#BEDDFC",
                  }}
                  className="tag-no-brightness-change"
                  sx={{
                    transition: "filter 0.1s",
                    "&:hover": {
                      filter: "brightness(100%)",
                    },
                  }}
                >
                  {`${props.numCards} CARDS`}
                </Tag>
              </div>
            </Box>
            {props.accountType && props.accountType == Role.TEACHER && (
              <HStack mb={"1vh"}>
                <IconButton
                  variant="outline"
                  aria-label="Edit card"
                  backgroundColor={"mediumBlue.500"}
                  icon={<EditIcon color="white" />}
                  sx={{
                    "&:hover": {
                      backgroundColor: "mediumBlue.700",
                    },
                  }}
                  className="tag-no-brightness-change"
                  onClick={onEdit}
                />

                <IconButton
                  className="tag-no-brightness-change"
                  variant="outline"
                  aria-label="Delete card"
                  backgroundColor={"mediumBlue.500"}
                  icon={<DeleteIcon color="white" />}
                  sx={{
                    "&:hover": {
                      backgroundColor: "mediumBlue.700",
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
        </Box>
      </CardBody>
    </Card>
  );
};

export default SetCard;
