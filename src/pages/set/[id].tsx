import { useEffect, useState } from "react"; // Import useState hook
import { useRouter } from "next/router";
import FlashCard from "~/components/Flashcard";
import { api } from "~/utils/api";
import { Icon, Spinner, Tooltip, useToast } from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  InfoOutlineIcon,
} from "@chakra-ui/icons";
import Canvas from "~/components/Canvas";
import { type Card } from "@prisma/client";
import ProgressBar from "~/components/Progress/ProgressBar";

const Set = ({
  tempIdx,
  pomodoroConst = 5,
}: {
  tempIdx: number | undefined;
  pomodoroConst?: number;
}) => {
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
  const toast = useToast();

  useEffect(() => {
    if (cards) {
      setFlashcards(cards);
    }
  }, [cards]);

  if (!cards || !set) {
    return <Spinner />;
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
        if (prevMaxIndex !== newMaxIndex && newMaxIndex % pomodoroConst == 0) {
          setShowCanvas(true);
        }
        return newMaxIndex;
      });

      return newCurIndex;
    });

    toast({
      title: "That is correct!",
      status: "success",
      duration: 3000,
      isClosable: false,
      position: "top",
    });
  };

  const handleIncorrectAnswer = () => {
    toast({
      title: "Try again!",
      status: "error",
      duration: 3000,
      isClosable: false,
      position: "top",
    });
  };

  return (
    <div className="flex h-screen w-screen flex-col items-start justify-start">
      {showCanvas ? (
        <Canvas setShowCanvas={setShowCanvas} />
      ) : (
        <>
          <p className="w-full pb-16 pt-8 text-center font-bold">
            {set.name}
            &nbsp;
            <Tooltip label={`Mode: ${set.check_mode}, ${set.answer_mode}`}>
              <Icon as={InfoOutlineIcon} color="lightgray" />
            </Tooltip>
          </p>
          <ProgressBar
            percentage={(100 * maxIndex) / cards.length}
            shouldApplyMargin={true}
          />
          {curIndex >= 0 &&
          flashcards &&
          curIndex < flashcards.length &&
          flashcards[curIndex] ? (
            <FlashCard
              key={flashcards[curIndex]!.id}
              card={flashcards[curIndex]!}
              onCorrectCallback={() => {
                handleCorrectAnswer();
              }}
              onIncorrectCallback={() => {
                handleIncorrectAnswer();
              }}
              checkMode={set?.check_mode}
              answerMode={set?.answer_mode}
              moveCurrentCardToEnd={moveCurrentCardToEnd}
              curIndex={curIndex}
              maxIndex={maxIndex}
              setLength={flashcards.length}
              setMaxIndex={setMaxIndex}
            />
          ) : (
            // TODO: Replace with return to dashboard / restart set options
            <div>No card available</div>
          )}
          <div className="align-center w-screen flex-col items-center justify-center">
            <div className="flex flex-row justify-between">
              <button
                onClick={() => setCurIndex(curIndex - 1)}
                className={`flex flex-row items-center justify-center p-8 ${curIndex === 0 ? "invisible" : "visible"}`}
              >
                <Icon as={ChevronLeftIcon} />
                Back
              </button>
              <button
                onClick={() => setCurIndex(curIndex + 1)}
                // If the user is at the end or if the user has not attempted to answer the question, hide the next button
                className={`flex flex-row items-center justify-center p-8 ${maxIndex === curIndex ? "invisible" : "visible"}`}
              >
                Next
                <Icon as={ChevronRightIcon} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Set;
