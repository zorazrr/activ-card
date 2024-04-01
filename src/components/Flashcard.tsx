import { SetType, type Card } from "@prisma/client";
import {
  useEffect,
  useState,
  type FC,
  type SetStateAction,
  type Dispatch,
} from "react";
import { api } from "~/utils/api";
import AudioRecorder from "./AudioRecorder";
import {
  Divider,
  HStack,
  Spinner,
  Stack,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import StyledButton from "./Button";

interface FlashCardProps {
  card: Card;
  onCorrectCallback?: () => void;
  onIncorrectCallback?: () => void;
  moveCurrentCardToEnd: () => void;
  curIndex: number;
  maxIndex: number;
  setLength: number;
  setMaxIndex: Dispatch<SetStateAction<number>>;
  compLevel: number | undefined;
}

const FlashCard: FC<FlashCardProps> = ({
  card,
  onCorrectCallback,
  onIncorrectCallback,
  moveCurrentCardToEnd,
  curIndex,
  maxIndex,
  setLength,
  setMaxIndex,
  compLevel,
}) => {
  const [studentInput, setStudentInput] = useState<string>("");
  const [studentAudioText, setStudentAudioText] = useState<string>();
  const [answerExplanation, setAnswerExplanation] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(true);
  const [shouldDisplayAnswer, setShouldDisplayAnswer] = useState(false);
  const [isProcessingRecordedAnswer, setIsProcessingRecordedAnswer] =
    useState(false);
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);
  const checkAnswerMutation = api.gpt.checkAnswer.useMutation({ retry: false });

  const handleShowCorrectAnswerAffirmation = () => {
    // Workaround
    // So, moving the current card to the end didn't work when moving the card already in the last position to the end, even after making a deep
    // copy; therefore, we will just stop displaying the answer, and allow the student to submit the answer if this is the case
    const front = document.getElementById("front");
    const back = document.getElementById("back");

    front.style.visibility = "visible";
    back.style.backfaceVisibility = "hidden";
    back.style.transform = "rotateX(180deg)";

    if (curIndex === setLength - 1) {
      setShouldDisplayAnswer(false);
      setAnswerExplanation("");
    } else {
      // If a student says they do not know for a flashcard they have previously answered, they should not be able to skip a card they have not answered
      if (curIndex < maxIndex) {
        setMaxIndex((prevMaxIndex) => {
          return prevMaxIndex - 1;
        });
      }
      moveCurrentCardToEnd();
    }

    setIsAnimationCompleted(false);
  };

  const checkAnswer = () => {
    if (studentAudioText) {
      console.log("Checking answer with audio");
      checkAnswerMutation.mutate(
        {
          term: card.term,
          definition: card.definition,
          studentInput: studentAudioText,
          type: card.type,
          compLevel: compLevel,
        },
        {
          onSuccess: ({ isCorrect, feedback }) => {
            setIsCorrect(isCorrect);
            setAnswerExplanation(feedback as string);
            // if (isCorrect) {
            //   onCorrectCallback?.();
            // } else {
            //   onIncorrectCallback?.();
            // }
          },
        },
      );
    } else {
      checkAnswerMutation.mutate(
        {
          term: card.term,
          definition: card.definition,
          studentInput: studentInput,
          type: card.type,
          compLevel: compLevel,
        },
        {
          onSuccess: ({ isCorrect, feedback }) => {
            setIsCorrect(isCorrect);
            setAnswerExplanation(feedback as string);
            // if (isCorrect) {
            //   onCorrectCallback?.();
            // } else {
            //   onIncorrectCallback?.();
            // }
          },
        },
      );
    }
    setShouldDisplayAnswer(true);
  };

  // TODO [ARCHNA + VASU DISCUSS]: Add enable auto check where you don't have to press check but just stop and start recording

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      checkAnswer();
    }
  };

  function handleKeyUp(e) {
    //key code for enter
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  }

  const onAnimationEnd = () => {
    setIsAnimationCompleted(true);
    setShouldDisplayAnswer(true);

    const front = document.getElementById("front");
    const back = document.getElementById("back");

    front.style.visibility = "hidden";
    back.style.backfaceVisibility = "visible";
    back.style.transform = "rotateX(0deg)";
  };

  // Function to display the answer after animation completion
  useEffect(() => {
    if (answerExplanation) {
      setAnswerExplanation(answerExplanation);
    }
  }, [isAnimationCompleted, answerExplanation]);

  useEffect(() => {
    if (studentAudioText !== undefined) {
      checkAnswer();
      setIsProcessingRecordedAnswer(false);
      setStudentInput(studentAudioText);
      setStudentAudioText(undefined);
    }
  }, [studentAudioText]);

  return (
    <div className="relative flex h-full flex-col items-center justify-evenly">
      <div className="perspective flex h-[60%] w-screen flex-row items-center justify-between gap-12 px-40 text-lg">
        <div
          className={`${shouldDisplayAnswer && "animate-flip"} preserve-3d flex h-full w-full flex-row items-center justify-center rounded-lg border bg-gray-100 p-10`}
          onAnimationEnd={onAnimationEnd}
        >
          <div
            id="front"
            className={`backface-hidden absolute m-auto font-bold`}
          >
            {card.term}
          </div>
          <VStack
            w="100%"
            h="100%"
            gap="20px"
            alignItems="start"
            className="backface-hidden my-rotate-x-180"
            id="back"
          >
            <p className="self-center font-bold">{card.term}</p>
            <Divider borderWidth="0.5px" borderColor="darkgray" />
            <p>
              <span style={{ fontWeight: 600 }}>Correct Answer </span>
              {card.definition}
            </p>
          </VStack>
        </div>
        <div className="flex h-full w-full flex-col gap-2">
          {isProcessingRecordedAnswer ? (
            <Stack
              h="full"
              justifyContent="center"
              alignItems="center"
              borderRadius="md"
              border="1px lightgray solid"
            >
              <Spinner />
            </Stack>
          ) : (
            <Textarea
              isDisabled={
                card.type == SetType.LITERACY ||
                shouldDisplayAnswer ||
                answerExplanation !== ""
              }
              h="full"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              onKeyDown={handleKeyPress}
              onKeyUp={handleKeyUp}
              placeholder={
                card.type == SetType.LITERACY
                  ? "Press the icon to get started reading!"
                  : "Start typing or press icon to speak."
              }
            />
          )}
          <div className="flex w-full flex-row justify-between">
            <AudioRecorder
              textCallBack={setStudentAudioText}
              shouldDisplayAnswer={
                shouldDisplayAnswer || answerExplanation !== ""
              }
              setIsProcessingRecordedAnswer={setIsProcessingRecordedAnswer}
            />
            <div className="flex flex-row gap-x-3">
              <button
                onClick={() => setShouldDisplayAnswer(true)}
                className="h-fit w-fit rounded-lg bg-midBlue px-6 py-1 text-sm text-white"
                disabled={shouldDisplayAnswer || answerExplanation !== ""}
              >
                {`I Don't Know`}
              </button>
              <button
                onClick={() => checkAnswer()}
                className="h-fit w-fit rounded-lg bg-darkBlue px-6 py-1 text-sm text-white"
                disabled={shouldDisplayAnswer || answerExplanation !== ""}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
      {checkAnswerMutation.isLoading ||
      (shouldDisplayAnswer && !isAnimationCompleted) ? (
        <Spinner />
      ) : answerExplanation === "" ? (
        shouldDisplayAnswer ? (
          <div className="flex w-screen justify-center px-12">
            <StyledButton
              label="Got It!"
              colorInd={0}
              onClick={handleShowCorrectAnswerAffirmation}
              style={{
                width: "300%",
                paddingTop: "15px",
                paddingBottom: "15px",
              }}
            />
          </div>
        ) : (
          <div></div>
        )
      ) : isCorrect ? (
        <div className="flex w-3/4 flex-col rounded-lg border border-green-400 px-12 py-5">
          <div className="pb-5 font-bold">Feedback</div>
          <div dangerouslySetInnerHTML={{ __html: answerExplanation }} />
          <button
            onClick={() => onCorrectCallback?.()}
            className="mt-6 h-fit w-fit self-end rounded-lg bg-darkBlue px-6 py-1 text-sm text-white"
          >
            Got It!
          </button>
        </div>
      ) : (
        <div className="flex w-3/4 flex-col rounded-lg border border-red-300 px-12 py-5">
          <div className="pb-5 font-bold">Feedback</div>
          <div dangerouslySetInnerHTML={{ __html: answerExplanation }} />
          <button
            onClick={handleShowCorrectAnswerAffirmation}
            className="mt-6 h-fit w-fit self-end rounded-lg bg-darkBlue px-6 py-1 text-sm text-white"
          >
            Got It!
          </button>
          {/* TODO: Change GOT IT to icon? */}
        </div>
      )}
    </div>
  );
};

export default FlashCard;
