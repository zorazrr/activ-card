import { useEffect, useState } from "react"; // Import useState hook
import { useRouter } from "next/router";
import FlashCard from "~/components/Flashcard";
import { api } from "~/utils/api";
import {
  Box,
  HStack,
  Icon,
  Link,
  Spinner,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Canvas from "~/components/Canvas";
import { type Card } from "@prisma/client";
import Image from "next/image";
import _ from "lodash";
import ProgressBar from "~/components/Progress/ProgressBar";

const Set = ({ tempIdx }: { tempIdx: number | undefined }) => {
  const setId = useRouter().query.id;
  const { data: cards } = api.card.getCardsBySet.useQuery(
    { setId: setId as string },
    { enabled: !!setId, retry: false, refetchOnWindowFocus: false },
  );
  const { data: set } = api.set.getOneSet.useQuery(
    { setId: setId as string },
    { enabled: !!setId, retry: false, refetchOnWindowFocus: false },
  );
  const [curIndex, setCurIndex] = useState<number>(tempIdx ? tempIdx : 0);
  const [flashcards, setFlashcards] = useState<Card[] | undefined>();

  // Tracks the farthest card they have attempted to answer
  const [maxIndex, setMaxIndex] = useState<number>(curIndex);
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const [isReview, setIsReview] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    if (cards) {
      setFlashcards(cards);
    }
  }, [cards]);

  if (!cards || !set) {
    return (
      <Stack h="100%" w="100%" justifyContent="center" alignItems="center">
        <Spinner />
      </Stack>
    );
  }

  const moveCurrentCardToEnd = () => {
    if (flashcards) {
      const flashcardsSorted = [...flashcards];

      // @ts-ignore because flashcardsSorted should exist based on the if statement above
      flashcardsSorted.push(flashcardsSorted.splice(curIndex, 1)[0]);
      setFlashcards(flashcardsSorted);
    }
  };

  const handleCorrectAnswer = () => {
    // Set is async
    setCurIndex(() => {
      const newCurIndex = curIndex + 1;

      // If they get a previous card right, their max index reached should not increase
      setMaxIndex((prevMaxIndex) => {
        const newMaxIndex = Math.max(newCurIndex, prevMaxIndex);

        // Make sure the user cannot go back and replay the Pomodoro if they just played and haven't answered the next question
        if (
          prevMaxIndex !== newMaxIndex &&
          set.config.pomodoro &&
          newMaxIndex % set.config.pomodoroCards == 0
        ) {
          setShowCanvas(true);
        }
        return newMaxIndex;
      });

      return newCurIndex;
    });

    // toast({
    //   title: _.sample([
    //     "Nice work!",
    //     "Amazing Job!",
    //     "Way to go!",
    //     "Show em' how it's done!",
    //     "You got brains!",
    //   ]),
    //   status: "success",
    //   duration: 3000,
    //   isClosable: false,
    //   position: "top",
    // });
  };

  // const handleIncorrectAnswer = () => {
  // toast({
  //   title: _.sample([
  //     "Try again!",
  //     "You've got this!",
  //     "So close!",
  //     "Keep going!",
  //     "Practice makes perfect!",
  //   ]),
  //   status: "error",
  //   duration: 3000,
  //   isClosable: false,
  //   position: "top",
  // });
  // };

  const restartSet = () => {
    setFlashcards(cards);
    setCurIndex(0);
    setMaxIndex(0);
    setShowCanvas(false); // Redundant but in case
  };

  const navigateHome = () => {
    window.location.href = `../dashboard`;
  };

  return (
    <div className="flex h-screen w-screen flex-col items-start justify-start">
      {showCanvas ? (
        <Canvas
          setShowCanvas={setShowCanvas}
          setId={setId as string}
          pomodoroTime={set.config.pomodoroTimer}
        />
      ) : (
        <>
          <HStack>
            <HStack pt={8} pl={8} alignItems={"center"} w={"100vw"}>
              <div className="hover:opacity-75">
                <Link
                  href="/dashboard"
                  className="flex flex-col 2xl:flex-row"
                  onClick={navigateHome}
                >
                  <Image
                    src="/assets/logo.png"
                    alt="header"
                    width={60}
                    height={60}
                  />
                </Link>
              </div>
              <HStack pl={"3.75vw"} flexGrow={0.02}>
                <div className="text-4xl font-semibold">{set.name}</div>
              </HStack>
              {flashcards && (
                <Box flexGrow={0.85}>
                  <ProgressBar
                    percentage={(100 * maxIndex) / flashcards.length}
                    shouldApplyMargin={false}
                    width={100}
                    shouldApplyBorderRadius={true}
                  />
                </Box>
              )}
            </HStack>
          </HStack>
          {curIndex >= 0 &&
          flashcards &&
          curIndex < flashcards.length &&
          flashcards[curIndex] ? (
            <>
              <FlashCard
                key={flashcards[curIndex]!.id}
                card={flashcards[curIndex]!}
                onCorrectCallback={() => {
                  handleCorrectAnswer();
                }}
                // onIncorrectCallback={() => {
                //   handleIncorrectAnswer();
                // }}
                moveCurrentCardToEnd={moveCurrentCardToEnd}
                curIndex={curIndex}
                maxIndex={maxIndex}
                setLength={flashcards.length}
                setMaxIndex={setMaxIndex}
                compLevel={set.config.comprehensionLevel}
              />
            </>
          ) : (
            <div className="align-center flex h-full w-screen flex-col items-center justify-center space-y-6">
              <button
                onClick={navigateHome}
                className="reg-text w-32 rounded-md bg-mediumBlue  py-2 text-white hover:opacity-75"
                style={{
                  minWidth: "20%",
                  paddingTop: "15px",
                  paddingBottom: "15px",
                  marginBottom: "1%",
                }}
              >
                Return Home
              </button>
              <button
                onClick={restartSet}
                className="reg-text w-32 rounded-md bg-midBlue py-2 text-white hover:opacity-75"
                style={{
                  minWidth: "20%",
                  paddingTop: "20px",
                  paddingBottom: "15px",
                  marginBottom: "3%",
                }}
              >
                Restart Set
              </button>
            </div>
          )}
          {/* <div
            className={`align-center w-screen flex-col items-center justify-center ${isReview ? "invisible" : "visible"}`}
          >
            <div className="flex flex-row justify-between">
              <button
                onClick={() => setCurIndex(curIndex - 1)}
                className={`flex flex-row items-center justify-center p-8 ${curIndex === 0 || curIndex === flashcards?.length ? "invisible" : "visible"}`}
              >
                <Box p={2} _hover={{ backgroundColor: "gray.100" }}>
                  <Icon as={ChevronLeftIcon} />
                </Box>
              </button>
              <button
                onClick={() => setCurIndex(curIndex + 1)}
                // If the user is at the end or if the user has not attempted to answer the question, hide the next button
                className={`flex flex-row items-center justify-center p-8 ${maxIndex === curIndex ? "invisible" : "visible"}`}
              >
                <Box p={2} _hover={{ backgroundColor: "gray.100" }}>
                  <Icon as={ChevronRightIcon} />
                </Box>
              </button>
            </div>
          </div> */}
        </>
      )}
    </div>
  );
};

export default Set;
