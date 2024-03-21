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
  Tooltip,
  Icon,
} from "@chakra-ui/react";
import StyledModal from "~/components/Modal";
import { api } from "~/utils/api";
import { useState } from "react";
import { type TermDefPair } from "~/utils/types";
import { InfoOutlineIcon } from "@chakra-ui/icons";

export default function SetCreationMediumSelection() {
  const router = useRouter();
  const grades = [
    { key: 0, label: "Kindergarten" },
    { key: 1, label: "1st Grade" },
    { key: 2, label: "2nd Grade" },
    { key: 3, label: "3rd Grade" },
    { key: 4, label: "4th Grade" },
    { key: 5, label: "5th Grade" },
    { key: 6, label: "6th Grade" },
    { key: 7, label: "7th Grade" },
    { key: 8, label: "8th Grade" },
    { key: 9, label: "9th Grade" },
    { key: 10, label: "10th Grade" },
    { key: 11, label: "11th Grade" },
    { key: 12, label: "12th Grade" },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isFocusEnabled, setIsFocusEnabled] = useState(true);

  const [flashcards, setFlashcards] = useState<TermDefPair[]>([]);
  const [subject, setSubject] = useState<string>("");
  const [formData, setFormData] = useState<any>();

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
    const body = {};
    for (const [key, value] of form.entries()) {
      body[key] = value;
    }
    console.log(body);
    setFormData(body);

    // Do Further input validation and submit the form
    setPage(2);
  }

  const handleOnFocusChange = (value) => {
    setIsFocusEnabled(value === "Yes" ? true : false);
  };

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
                  <FormLabel>
                    Type of Set &nbsp;{" "}
                    <Tooltip label={`Mode:}`}>
                      <Icon as={InfoOutlineIcon} color="gray" />
                    </Tooltip>
                  </FormLabel>
                  <RadioGroup name="setType" defaultValue="Assignment" w="100%">
                    <HStack
                      spacing="auto"
                      w="100%"
                      // justifyContent="space-between"
                      gap="5%"
                    >
                      <Radio value="Assignment" w="20%">
                        Assignment &nbsp;
                      </Radio>

                      <Radio value="Inverted Classroom" w="20%">
                        Inverted Classroom
                      </Radio>
                      <Radio value="Literacy" w="20%">
                        Literacy
                      </Radio>
                      <Radio value="Theory" w="20%">
                        Theory
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
                <FormControl>
                  <FormLabel>Reading Comprehension Level</FormLabel>
                  <Select
                    name="readingComprehensionLevel"
                    placeholder="Select Grade"
                  >
                    {grades.map((grade) => {
                      return (
                        <option value={grade.key} key={grade.key}>
                          {grade.label}
                        </option>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Enable Pomodoro Focus &nbsp;
                    <Tooltip label={`Mode:}`}>
                      <Icon as={InfoOutlineIcon} color="gray" />
                    </Tooltip>
                  </FormLabel>
                  <RadioGroup
                    defaultValue="Yes"
                    w="100%"
                    onChange={handleOnFocusChange}
                    name="isFocusEnabled"
                  >
                    <HStack spacing="auto" w="100%" gap="5%">
                      <Radio value="Yes" w="20%">
                        Yes
                      </Radio>
                      <Radio value="No" w="20%">
                        No
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
                {isFocusEnabled && (
                  <>
                    <FormControl>
                      <FormLabel>
                        Number of Cards Between Pomodoro Breaks &nbsp;
                        <Tooltip label={`Mode:}`}>
                          <Icon as={InfoOutlineIcon} color="gray" />
                        </Tooltip>
                      </FormLabel>
                      <NumberInput
                        name="pomodoroIntervalLength"
                        defaultValue={5}
                        min={3}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl>
                      <FormLabel>
                        Length (in Seconds) of Pomodoro Break
                      </FormLabel>
                      <NumberInput
                        name="pomodoroTimeLimit"
                        defaultValue={60}
                        min={180}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </>
                )}
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
                <Button type="submit" w="40%" mt={4} py={4}>
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

// TODO: Connect FE with BE
// TODO: Change page 2 of medium.tsx to use dashboard tabs and emulate YT video
// TODO: Fill out tool tips
// TODO: Consider passive vs active review
// TODO: Add back arrow
