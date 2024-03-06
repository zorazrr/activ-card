import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Card,
  CardBody,
  Flex,
  IconButton,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  type TermDefPair,
  type CardUpdateParams,
  type CardRemoveParams,
} from "~/utils/types";
import { api } from "~/utils/api";
import { DeleteIcon } from "@chakra-ui/icons";

const CardPair = ({
  term,
  def,
  idx,
  updateCard,
  removeCard,
}: TermDefPair & {
  idx: number;
  updateCard: (props: CardUpdateParams) => void;
  removeCard: (props: CardRemoveParams) => void;
}) => {
  const [cardTerm, setCardTerm] = useState(term);
  const [cardDef, setCardDef] = useState(def);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      updateCard({ id: idx, term: cardTerm, def: cardDef });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [cardTerm, cardDef]);

  return (
    <Card w="100%" mb={5} borderRadius={3}>
      <Flex className="bg-lightGray" flexDirection={"column"} height="30vh">
        <Flex justifyContent="space-between" h="100%">
          <CardBody w="30%" pr={2} pb={0}>
            <Textarea
              placeholder="Type a term here..."
              wordBreak="break-all"
              value={cardTerm}
              onChange={(e) => setCardTerm(e.target.value)}
              h="100%"
              sx={{ wordWrap: "normal" }}
              backgroundColor="white"
            />
          </CardBody>
          <CardBody w="40%" pl={2} pb={0}>
            <Textarea
              placeholder="Type a definition here..."
              wordBreak="break-all"
              value={cardDef}
              onChange={(e) => setCardDef(e.target.value)}
              h="100%"
              overflowWrap="normal"
              backgroundColor="white"
            />
          </CardBody>
        </Flex>
        <div style={{ margin: "auto" }}>
          <IconButton
            variant="outline"
            aria-label="Delete card"
            backgroundColor={"#4A729D"}
            icon={<DeleteIcon color="white" />}
            onClick={onOpen}
            size={"md"}
            _hover={{
              opacity: 0.75,
            }}
            ml={"69vw"}
            mt={"0.5vh"}
            mb={"0.5vh"}
          />
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
                  Delete Card
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
                    onClick={() => removeCard({ id: idx })}
                    ml={3}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </div>
      </Flex>
    </Card>
  );
};

export default CardPair;
