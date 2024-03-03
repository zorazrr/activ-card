import { Box, HStack, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useState } from "react";
import StyledButton from "~/components/Button";
import CardPair from "~/components/CardPair";
import { api } from "~/utils/api";
import type { TermDefPair } from "~/utils/types";

// pass the set id as query param
export default function EditSet() {
  const [setName, setSetName] = useState("");
  const [setDescription, setSetDescription] = useState("");
  const [flashcards, setFlashcards] = useState<TermDefPair[]>([]);
  const setId = useRouter().query.id as string;

  const updateCard = ({
    id,
    term,
    def,
  }: {
    id: number;
    term: string;
    def: string;
  }) => {
    if (flashcards?.[id]) {
      flashcards[id].term = term;
      flashcards[id].def = def;
    }
  };

  const { data: cards } = api.card.geCardBySet.useQuery(
    { setId: setId },
    {
      retry: false,
      enabled: !!setId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) {
          const mappedCards: TermDefPair[] = data.map((card) => {
            return { term: card.term, def: card.definition };
          });
          setFlashcards([...mappedCards]);
        }
      },
    },
  );

  const { data: set } = api.set.getOneSet.useQuery(
    { setId: setId },
    {
      retry: false,
      enabled: !!setId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        if (data) {
          setSetName(data.name);
          setSetDescription(data.description);
        }
      },
    },
  );

  const updateSetMutation = api.set.updateSet.useMutation({
    retry: false,
    onSuccess: (data) => {
      if (data) {
        window.location.href = `../../dashboard`;
        console.log(data);
      }
    },
  });

  const updateSet = () => {
    updateSetMutation.mutate({
      setId: setId,
      setName: setName,
      setDescription: setDescription,
      cards: flashcards,
    });
  };

  const addCard = () => {
    setFlashcards([...flashcards, { term: "", def: "" }]);
  };

  if (!cards || !set) {
    return <div>Loading...</div>;
  }

  return (
    <VStack padding={16} w="100%">
      <Box w="80%">
        <HStack mb={3}>
          <Input
            border="none"
            _hover={{ border: "none" }}
            className="h1"
            fontSize="5xl"
            placeholder="Set Name"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
          <StyledButton onClick={updateSet} colorInd={0} label="Create" />
        </HStack>
        <Textarea
          className="main-class tiny-text"
          placeholder="Description (optional)"
          defaultValue={setDescription}
          onChange={(e) => setSetDescription(e.target.value)}
          mb={2}
        />
        {/* <Divider /> */}
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
            key={id}
            term={flashcard.term}
            def={flashcard.def}
            idx={id}
            updateCard={updateCard}
          />
        ))}
      </Box>
      <StyledButton colorInd={0} onClick={addCard} label="Add Card" />
    </VStack>
  );
}
