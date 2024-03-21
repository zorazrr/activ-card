import { ChevronLeftIcon } from "@chakra-ui/icons";
import {
  Box,
  Divider,
  HStack,
  Icon,
  Input,
  Text,
  Textarea,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { type Card } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import StyledButton from "~/components/Button";
import CancelSetCreationOrUpdateModal from "~/components/CancelSetCreationOrUpdateModal";
import CancelSetCreationModal from "~/components/CancelSetCreationOrUpdateModal";
import CardPair from "~/components/CardPair";
import { api } from "~/utils/api";
import type { CardInfo, TermDefPair } from "~/utils/types";

// pass the set id as query param
export default function EditSet() {
  const [setName, setSetName] = useState("");
  const [setDescription, setSetDescription] = useState("");
  const [flashcards, setFlashcards] = useState<CardInfo[]>([]);
  const setId = useRouter().query.id as string;
  const isEdit = !!(useRouter().query?.isEdit as string);
  const [tempId, setTempId] = useState<number>(0);
  const [attemptedCreateWithoutSetName, setAttemptedCreateWithoutSetName] =
    useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateCard = ({
    id,
    term,
    def,
  }: {
    id: number;
    term: string;
    def: string;
  }) => {
    const updatedFlashcards = flashcards.map((flashcard, idx) => {
      if (idx === id) {
        return { ...flashcard, term: term, def: def };
      }
      return flashcard;
    });

    setFlashcards(updatedFlashcards);
  };

  const removeCard = ({ id }: { id: number }) => {
    const updatedFlashcards = flashcards.filter((_, idx) => idx !== id);
    setFlashcards(updatedFlashcards);
  };

  const { data: set } = api.set.getOneSet.useQuery(
    { setId: setId },
    {
      retry: false,
      enabled: !!setId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) {
          setSetName(data.name);
          setSetDescription(data.description!);
          const mappedCards: CardInfo[] = data.cards.map((card: Card) => {
            return { term: card.term, def: card.definition, id: card.id };
          });
          setFlashcards([...mappedCards]);
        }
      },
    },
  );

  const updateSetMutation = api.set.updateSet.useMutation({
    retry: false,
    onSuccess: (data) => {
      if (data) {
        window.location.href = `../../dashboard`;
      }
    },
  });

  const updateSet = () => {
    if (!setName) {
      setAttemptedCreateWithoutSetName(true);
      return;
    }

    updateSetMutation.mutate({
      setId: setId,
      setName: setName,
      setDescription: setDescription,
      cards: flashcards,
    });
  };

  const addCard = () => {
    setFlashcards([...flashcards, { term: "", def: "", id: String(tempId) }]);
    setTempId((prevId) => prevId + 1);
  };

  // Define the hook outside the object literal
  const deleteSetMutation = api.set.deleteSet.useMutation({
    retry: false,
    onSuccess: () => {
      window.location.href = `../../dashboard`;
    },
  });

  // Use the hook inside the object literal
  const deleteSet = () => {
    deleteSetMutation.mutate({ setId: setId });
  };

  const navigateHome = () => {
    window.location.href = "../../dashboard";
  };

  useEffect(() => {
    if (!flashcards || flashcards.length === 0) {
      setFlashcards([{ term: "", def: "", id: String(tempId) }]);
      setTempId((prevId) => prevId + 1);
    }
  }, [flashcards]);

  if (!set?.cards || !set) {
    return <div>Loading...</div>;
  }

  return (
    <VStack padding={16} w="100%">
      <CancelSetCreationOrUpdateModal
        onClose={onClose}
        isOpen={isOpen}
        onClick={isEdit ? navigateHome : deleteSet}
        isEdit={isEdit}
        isCentered
      />
      <button
        onClick={onOpen}
        className={`absolute left-1 top-1 flex flex-row items-center justify-center p-8`}
      >
        <Icon as={ChevronLeftIcon} />
        Back
      </button>
      <Box w="80%">
        <HStack>
          <Input
            border="none"
            _hover={{ border: "none" }}
            className="h1"
            fontSize="5xl"
            placeholder="Set Name"
            py={8}
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            isInvalid={!setName && attemptedCreateWithoutSetName}
            errorBorderColor="crimson"
          />

          <StyledButton
            onClick={updateSet}
            colorInd={0}
            label={isEdit ? "Update Set" : "Create"}
          />
        </HStack>
        <p
          className={`mb-2 text-xs text-red-700 ${!setName && attemptedCreateWithoutSetName ? "visible" : "invisible"}`}
        >
          You must give this set a name
        </p>
        <Textarea
          className="main-class tiny-text"
          placeholder="Description (optional)"
          defaultValue={setDescription}
          onChange={(e) => setSetDescription(e.target.value)}
          mb={2}
        />
        <Divider mt={8} mb={2} />
        <HStack>
          <Text w="50%" className="h5" mt={3} mb={1} pl={1}>
            Terms
          </Text>
          <Text w="50%" className="h5" mt={3} mb={1} pl={1}>
            Definitions
          </Text>
        </HStack>

        {flashcards?.map((flashcard, id) => (
          <CardPair
            key={flashcard.id}
            term={flashcard.term}
            def={flashcard.def}
            idx={id}
            updateCard={updateCard}
            removeCard={removeCard}
          />
        ))}
      </Box>
      <StyledButton colorInd={0} onClick={addCard} label="Add Card" />
    </VStack>
  );
}
