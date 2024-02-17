import {
  Box,
  Divider,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import StyledButton from "~/components/Button";
import CardPair from "~/components/CardPair";

// pass the set id as query param
export default function EditSet() {
  const [setName, setSetName] = useState("");
  const [setDescription, setSetDescription] = useState("");
  const [flashcards, setFlashcards] = useState([
    { term: "hola", def: "hiii" },
    { term: "adios", def: "goodbye" },
    { term: "soy", def: "i am" },
  ]);

  const addCard = () => {
    setFlashcards([...flashcards, { term: "", def: "" }]);
  };

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
          <StyledButton
            onClick={() => console.log("update flashcards")}
            colorInd={0}
            label="Create"
          />
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
          <CardPair key={id} term={flashcard.term} def={flashcard.def} />
        ))}
      </Box>
      <StyledButton colorInd={0} onClick={addCard} label="Add Card" />
    </VStack>
  );
}