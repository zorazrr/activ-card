import { useState } from "react"; // Import useState hook
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

  // Tracks the farthest card they have attempted to answer
  const [maxIndex, setMaxIndex] = useState<number>(curIndex);
  const [showCanvas, setShowCanvas] = useState<boolean>(false);
  const toast = useToast();

  if (!cards || !set) {
    return <Spinner />;
  }

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
          <p className="w-full pt-8 text-center font-bold">
            {set.name}
            &nbsp;
            <Tooltip label={`Mode: ${set.check_mode}, ${set.answer_mode}`}>
              <Icon as={InfoOutlineIcon} color="lightgray" />
            </Tooltip>
          </p>
          {curIndex >= 0 && curIndex < cards.length ? (
            <FlashCard
              key={cards[curIndex]!.id}
              card={cards[curIndex]}
              onCorrectCallback={() => {
                handleCorrectAnswer();
              }}
              onIncorrectCallback={() => {
                handleIncorrectAnswer();
              }}
              checkMode={set?.check_mode}
              answerMode={set?.answer_mode}
            />
          ) : (
            <div>No card available</div>
          )}
          <div className="w-screen flex-col items-center justify-center">
            <p className="text-center font-bold">
              {curIndex + 1} / {cards.length}
            </p>
            <div className="flex flex-row justify-between">
              <button
                onClick={() => setCurIndex(curIndex - 1)}
                disabled={curIndex === 0}
                className={`flex flex-row items-center justify-center p-8 ${curIndex === 0 ? "invisible" : "visible"}`}
              >
                <Icon as={ChevronLeftIcon} />
                Back
              </button>
              <button
                onClick={() => setCurIndex(curIndex + 1)}
                // If the user is at the end or if the user has not attempted to answer the question, disable the next button
                disabled={
                  curIndex === cards.length - 1 || maxIndex === curIndex
                }
                className={`flex flex-row items-center justify-center p-8 ${curIndex === cards.length - 1 || maxIndex === curIndex ? "invisible" : "visible"}`}
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
