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
import { SetConfig, type TermDefPair } from "~/utils/types";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { SetType } from "@prisma/client";
import { Config } from "tailwindcss";

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
  const [formData, setFormData] = useState<SetConfig>();

  const generateFlashcard =
    api.gpt.generateFlashcardsFromPromptedSubject.useQuery(
      {
        subject: subject,
        setType: formData?.setType,
        readingComprehensionLevel: formData?.readingComprehensionLevel,
      },
      {
        retry: false,
        onSuccess: (data) => setFlashcards(data),
        enabled: false,
      },
    );

  const createCards = api.card.createCardsforSet.useMutation({
    retry: false,
    onSuccess: (data) => {
      window.location.href = `../set/${data.id}`;
    },
  });

  const createSet = api.set.createSet.useMutation({
    retry: false,
    onSuccess: (data) =>
      createCards.mutate({
        setId: data.id,
        cards: flashcards,
        setType: formData?.setType,
      }),
  });

  const createNewSet = async () => {
    setIsLoading(true);
    onClose();
    await generateFlashcard.refetch();
    createSet.mutate({
      classId: router.query.classId as string,
      name: subject,
      config: formData!,
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
      config: formData!,
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
    setIsFocusEnabled(value === "true" ? true : false);
  };

  return (
    <>
      <div className="p-5 hover:opacity-75">
        <Link href="/dashboard">
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
                    <Tooltip
                      label={
                        <Text>
                          <b>Assignment: </b>
                          Use this mode to help students practice
                          conceptualizing terms and definitions, using their own
                          words to capture the meanings of terms.
                          <br />
                          <b>Inverted: </b>
                          Use this to help introduce and familiarize your
                          students with concepts they will be learning and
                          understand their current baseline knowledge of the
                          unit. Think of it as a pre-work assignment that
                          requires active engagement from their part.
                          <br />
                          <b>Literacy: </b>
                          Use this to help your students practice read-alongs.
                          You can generate custom sentences based on what
                          reading topics and skills you want to focus on with AI
                          checking their reading progress and providing you
                          feedback.
                          <br />
                          <b>Theory: </b>
                          Test your students on more open-ended and theoretical
                          questions on the subject matter!
                          <br />
                        </Text>
                      }
                    >
                      <Icon as={InfoOutlineIcon} color="gray" />
                    </Tooltip>
                  </FormLabel>
                  <RadioGroup
                    name="setType"
                    defaultValue={SetType.ASSIGNMENT}
                    w="100%"
                  >
                    <HStack
                      spacing="auto"
                      w="100%"
                      // justifyContent="space-between"
                      gap="5%"
                    >
                      <Radio value={SetType.ASSIGNMENT} w="20%">
                        Assignment &nbsp;
                      </Radio>

                      <Radio value={SetType.INVERTED} w="20%">
                        Inverted Classroom
                      </Radio>
                      <Radio value={SetType.LITERACY} w="20%">
                        Literacy
                      </Radio>
                      <Radio value={SetType.THEORY} w="20%">
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
                    isRequired
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
                    <Tooltip
                      backgroundColor="gray.100"
                      color="gray"
                      label={
                        <Text>
                          Pomodoro Focus will use the pomodoro technique to help
                          students pace their learning and take "brain" breaks
                          upon successful completion of subsets of cards.
                        </Text>
                      }
                    >
                      <Icon as={InfoOutlineIcon} color="gray" />
                    </Tooltip>
                  </FormLabel>
                  <RadioGroup
                    defaultValue="true"
                    w="100%"
                    onChange={handleOnFocusChange}
                    name="pomodoro"
                  >
                    <HStack spacing="auto" w="100%" gap="5%">
                      <Radio value="true" w="20%">
                        Yes
                      </Radio>
                      <Radio value="false" w="20%">
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
                        <Tooltip
                          label={
                            <Text>
                              This is the number of cards a student must
                              successfully answer before they unlock a break.
                            </Text>
                          }
                        >
                          <Icon as={InfoOutlineIcon} color="gray" />
                        </Tooltip>
                      </FormLabel>
                      <NumberInput
                        name="pomodoroCards"
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
                        name="pomodoroTimer"
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
                  formData={formData}
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
              {(isLoading || createSet.isLoading) && (
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

// TODO: Change page 2 of medium.tsx to use dashboard tabs and emulate YT video
// TODO: TEST ALL CHANGES!
// ASSIGNMENT
// INVERTED
// LITERACY
// THEORY
// TODO: Add back arrow between two modal pages
// TODO: Consider passive vs active review
// For now, maybe only show cards of same type but in future we can extend it to combine different types of sets or different types of cards
