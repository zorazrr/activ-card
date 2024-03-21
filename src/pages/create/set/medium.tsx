import Link from "next/link";
import StyledButton from "~/components/Button";
import StyledFileUpload from "~/components/FileUpload";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  FormControl,
  FormLabel,
  HStack,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  VStack,
  useDisclosure,
  Text,
  Input,
  NumberInput,
  Button,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import StyledModal from "~/components/Modal";
import { api } from "~/utils/api";
import { useState } from "react";
import { type TermDefPair } from "~/utils/types";

export default function SetCreationMediumSelection() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [flashcards, setFlashcards] = useState<TermDefPair[]>([]);
  const [subject, setSubject] = useState<string>("");

  const generateFlashcard =
    api.gpt.generateFlashcardsFromPromptedSubject.useQuery(
      { subject: subject },
      {
        retry: false,
        onSuccess: (data) => setFlashcards(data),
        enabled: false,
      },
    );

  const createCard = api.card.createCardsforSet.useMutation({
    retry: false,
    onSuccess: (data) => {
      window.location.href = `../set/${data.id}`;
    },
  });

  const createSet = api.set.createSet.useMutation({
    retry: false,
    onSuccess: (data) =>
      createCard.mutate({ setId: data.id, cards: flashcards }),
  });

  const createNewSet = async () => {
    await generateFlashcard.refetch();
    createSet.mutate({
      classId: router.query.classId as string,
      name: subject,
    });
  };

  const createSetFromScratch = api.set.createSet.useMutation({
    retry: false,
    onSuccess: (data) => (window.location.href = `../set/${data.id}`),
  });

  const createNewSetFromScratch = async () => {
    createSetFromScratch.mutate({
      classId: router.query.classId as string,
      name: subject,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const setType = form.get("Type of Set");
    const pomodoroIntervalLength = form.get(
      "Number of Cards Between Pomodoro Breaks",
    );
    const isReviewEnabled = form.get("Enable Review");
    console.log({ setType, pomodoroIntervalLength, isReviewEnabled });
    const body = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }
    console.log(body);
    // Do Further input validation and submit the form
    setPage(2);
  }

  return (
    <>
      <div className="p-5 hover:opacity-75">
        <Link href="/">
          <Image src="/assets/logo.png" alt="header" width={65} height={65} />
        </Link>
      </div>
      {/* Adjusted div for centering text */}
      <div
        className="flex items-start justify-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        {page === 1 && (
          <div
            className="text-center"
            style={{ marginTop: "5%", width: "60%" }}
          >
            <div className="h2 text-darkBlue">Create a Set</div>
            <br></br>
            <form onSubmit={handleSubmit}>
              <VStack spacing={8} w="100%">
                <FormControl w="100%">
                  <FormLabel>Type of Set</FormLabel>
                  <RadioGroup defaultValue="Assignment" w="100%">
                    <HStack
                      spacing="auto"
                      w="100%"
                      justifyContent="space-between"
                    >
                      <Radio value="Assignment">Assignment</Radio>
                      <Radio value="Inverted Classroom">
                        Inverted Classroom
                      </Radio>
                      <Radio value="Literacy">Literacy</Radio>
                      <Radio value="Theory">Theory</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Number of Cards Between Pomodoro Breaks</FormLabel>
                  <NumberInput defaultValue={5} min={3}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                {/* <FormControl w="100%">
                  <FormLabel>Enable Review</FormLabel>
                  <RadioGroup defaultValue="Yes" w="100%">
                    <HStack
                      spacing="auto"
                      w="100%"
                      justifyContent="space-between"
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl> */}
                <Button type="submit" w="100%" py={8}>
                  Next
                </Button>
              </VStack>
            </form>
          </div>
        )}
        {page === 2 && (
          <div className="text-center" style={{ marginTop: "5%" }}>
            <div className="h2 text-darkBlue">Create a Set</div>
            <br></br>
            <VStack spacing={8}>
              <HStack spacing={8}>
                <StyledFileUpload
                  classId={router.query.classId as string}
                  setIsLoading={setIsLoading}
                />
                <StyledButton
                  label="Generate Using AI"
                  colorInd={1}
                  onClick={onOpen}
                  style={{
                    width: "120%",
                    paddingTop: "13px",
                    paddingBottom: "13px",
                    marginRight: "5%",
                  }}
                />
                <div style={{ marginLeft: "25px " }}>
                  <StyledButton
                    label="Create from Scratch"
                    colorInd={1}
                    onClick={createNewSetFromScratch}
                    style={{
                      width: "120%",
                      paddingTop: "13px",
                      paddingBottom: "13px",
                      marginRight: "10%",
                    }}
                  />
                </div>
              </HStack>
              {isLoading && (
                <>
                  <Spinner size={"xl"} />
                  <div className="h4 text-darkBlue">Building your deck...</div>
                </>
              )}
            </VStack>
          </div>
        )}
      </div>
      <StyledModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={createNewSet}
        setSubject={setSubject}
      />
    </>
  );
}
