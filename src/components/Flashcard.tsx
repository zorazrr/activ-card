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
import { Divider, Spinner, Stack, Textarea, VStack } from "@chakra-ui/react";
import StyledButton from "./Button";
import ProgressBar from "./Progress/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

interface FlashCardProps {
  card: Card;
  onCorrectCallback?: () => void;
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
  const [answerHelp, setAnswerHelp] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean>(true);
  const [shouldDisplayAnswer, setShouldDisplayAnswer] = useState(false);
  const [isProcessingRecordedAnswer, setIsProcessingRecordedAnswer] =
    useState(false);
  const [isAnimationCompleted, setIsAnimationCompleted] = useState(false);
  const checkAnswerMutation = api.gpt.checkAnswer.useMutation({ retry: false });
  const getAnswerHelpMutation = api.gpt.getAnswerHelp.useMutation({
    retry: false,
  });

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
      setAnswerHelp("");
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

  const provideAnswerHelp = () => {
    getAnswerHelpMutation.mutate(
      {
        term: card.term,
        definition: card.definition,
        type: card.type,
        compLevel: compLevel,
      },
      {
        onSuccess: ({ feedback }) => {
          setAnswerHelp(feedback as string);
        },
      },
    );
    setShouldDisplayAnswer(true);
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
            // eslint-disable-next-line
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
            // eslint-disable-next-line
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
      {/* <ProgressBar
        percentage={(100 * maxIndex) / setLength}
        shouldApplyMargin={false}
        width={82}
        shouldApplyBorderRadius={true}
      /> */}
      <div className="flex h-[60%] w-screen flex-row items-center justify-between gap-12 px-40 text-lg perspective">
        <div
          className={`${shouldDisplayAnswer && "animate-flip"} flex h-full w-full flex-row items-center justify-center rounded-lg border bg-gray-100 p-10 preserve-3d`}
          onAnimationEnd={onAnimationEnd}
        >
          <div
            id="front"
            className={`absolute m-auto font-bold backface-hidden`}
          >
            {card.term}
          </div>
          <VStack
            w="100%"
            h="100%"
            gap="20px"
            alignItems="start"
            className="my-rotate-x-180 backface-hidden"
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
              isReadOnly={
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
                onClick={() => provideAnswerHelp()}
                className={`h-fit self-end rounded-lg bg-midBlue px-4 py-3 text-sm text-white ${!(shouldDisplayAnswer || answerExplanation !== "") && "hover:opacity-75"}`}
                disabled={shouldDisplayAnswer || answerExplanation !== ""}
              >
                {`I Don't Know`}
              </button>
              <button
                onClick={() => checkAnswer()}
                className={`h-fit self-end rounded-lg bg-mediumBlue px-4 py-3 text-sm text-white ${!(shouldDisplayAnswer || answerExplanation !== "") && "hover:opacity-75"}`}
                disabled={shouldDisplayAnswer || answerExplanation !== ""}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
      {checkAnswerMutation.isLoading ||
      getAnswerHelpMutation.isLoading ||
      (shouldDisplayAnswer && !isAnimationCompleted) ? (
        <Spinner />
      ) : answerExplanation === "" ? (
        shouldDisplayAnswer && answerHelp !== "" ? (
          <div className="flex w-3/4 flex-col rounded-lg border border-blue-400  px-12 py-5">
            <div className="pb-2 font-bold">Feedback</div>
            <div dangerouslySetInnerHTML={{ __html: answerHelp }} />
            <button
              onClick={handleShowCorrectAnswerAffirmation}
              className="mt-6 h-fit w-fit self-end rounded-lg bg-darkBlue px-4 py-3 text-sm text-white hover:opacity-75"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
            </button>
          </div>
        ) : (
          <div className="invisible flex w-3/4 flex-col rounded-lg border border-blue-400 px-12 py-5">
            <div className="pb-2 font-bold">Feedback</div>
            <div dangerouslySetInnerHTML={{ __html: answerExplanation }} />
            <button
              onClick={() => onCorrectCallback?.()}
              className="mt-6 h-fit w-fit self-end rounded-lg bg-darkBlue px-4 py-3 text-sm text-white hover:opacity-75"
            >
              <FontAwesomeIcon icon={faThumbsUp} />
            </button>
          </div>
        )
      ) : isCorrect ? (
        <div className="flex w-3/4 flex-col rounded-lg border border-green-400 px-12 py-5">
          <div className="pb-2 font-bold">Feedback</div>
          <div dangerouslySetInnerHTML={{ __html: answerExplanation }} />
          <button
            onClick={() => onCorrectCallback?.()}
            className="mt-6 h-fit w-fit self-end rounded-lg bg-darkBlue px-4 py-3 text-sm text-white hover:opacity-75"
          >
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>
        </div>
      ) : (
        <div className="flex w-3/4 flex-col rounded-lg border border-red-300 px-12 py-5">
          <div className="pb-5 font-bold">Feedback</div>
          <div dangerouslySetInnerHTML={{ __html: answerExplanation }} />
          <button
            onClick={handleShowCorrectAnswerAffirmation}
            className="mt-6 h-fit w-fit self-end rounded-lg bg-darkBlue px-4 py-3 text-sm text-white hover:opacity-75"
          >
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashCard;
