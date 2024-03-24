import { type Card, CheckMode, AnswerMode } from "@prisma/client";
import {
  useEffect,
  useState,
  type FC,
  type SetStateAction,
  type Dispatch,
} from "react";
import { api } from "~/utils/api";
import AudioRecorder from "./AudioRecorder";
import { Spinner, Textarea } from "@chakra-ui/react";

interface FlashCardProps {
  card: Card;
  onCorrectCallback?: () => void;
  onIncorrectCallback?: () => void;
  checkMode: CheckMode;
  answerMode: AnswerMode;
  moveCurrentCardToEnd: () => void;
  curIndex: number;
  maxIndex: number;
  setLength: number;
  setMaxIndex: Dispatch<SetStateAction<number>>;
}

const FlashCard: FC<FlashCardProps> = ({
  card,
  onCorrectCallback,
  onIncorrectCallback,
  checkMode,
  answerMode,
  moveCurrentCardToEnd,
  curIndex,
  maxIndex,
  setLength,
  setMaxIndex,
}) => {
  const [studentInput, setStudentInput] = useState<string>("");
  const [studentAudioText, setStudentAudioText] = useState<string>();
  const [answerExplanation, setAnswerExplanation] = useState<string>("");
  const [shouldDisplayAnswer, setShouldDisplayAnswer] = useState(false);
  const checkAnswerMutation = api.gpt.checkAnswer.useMutation({ retry: false });
  const explainAnswerMutation = api.gpt.explainAnswer.useMutation({
    retry: false,
  });

  const handleShowCorrectAnswerAffirmation = () => {
    // Workaround
    // So, moving the current card to the end didn't work when moving the card already in the last position to the end, even after making a deep
    // copy; therefore, we will just stop displaying the answer, and allow the student to submit the answer if this is the case
    if (curIndex === setLength - 1) {
      setShouldDisplayAnswer(false);
    } else {
      // If a student says they do not know for a flashcard they have previously answered, they should not be able to skip a card they have not answered
      if (curIndex < maxIndex) {
        setMaxIndex((prevMaxIndex) => {
          return prevMaxIndex - 1;
        });
      }
      moveCurrentCardToEnd();
    }
  };

  const checkAnswer = () => {
    if (checkMode === CheckMode.AI_CHECK) {
      checkAnswerMutation.mutate(
        {
          term: card.term,
          definition: card.definition,
          studentInput: studentInput,
        },
        {
          onSuccess: ({ isCorrect }) => {
            if (isCorrect) {
              onCorrectCallback?.();
            } else {
              explainAnswerMutation.mutate(
                {
                  term: card.term,
                  definition: card.definition,
                  studentInput: studentInput,
                },
                {
                  onSuccess: (data) => {
                    setAnswerExplanation(data!);
                  },
                },
              );
              onIncorrectCallback?.();
            }
          },
        },
      );
    } else {
      studentInput.toLowerCase() === card.definition.toLowerCase()
        ? onCorrectCallback?.()
        : onIncorrectCallback?.();
    }
    if (studentAudioText && answerMode === AnswerMode.SPEAKING) {
      console.log("Checking answer with audio");
      checkAnswerMutation.mutate(
        {
          term: card.term,
          definition: card.definition,
          studentInput: studentAudioText,
        },
        {
          onSuccess: ({ isCorrect }) => {
            if (isCorrect) {
              onCorrectCallback?.();
            } else {
              explainAnswerMutation.mutate(
                {
                  term: card.term,
                  definition: card.definition,
                  studentInput: studentAudioText,
                },
                {
                  onSuccess: (data) => {
                    setAnswerExplanation(data!);
                  },
                },
              );
              onIncorrectCallback?.();
            }
          },
        },
      );
    }
  };

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

  useEffect(() => {
    if (studentAudioText !== undefined) {
      checkAnswer();
      setStudentInput(studentAudioText);
      setStudentAudioText(undefined);
    }
  }, [studentAudioText]);

  return (
    <div className="flex h-full flex-col items-center justify-evenly">
      <div className="flex h-[60%] w-screen flex-row items-center justify-between gap-12 px-40 text-lg">
        <div className="flex h-full w-full flex-row items-center justify-center rounded-lg border bg-gray-100 p-10">
          <p>{card.term}</p>
        </div>
        <div className="flex h-full w-full flex-col gap-2">
          <Textarea
            h="full"
            value={studentInput}
            onChange={(e) => setStudentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            onKeyUp={handleKeyUp}
            placeholder="Start typing or press icon to speak."
          />
          <div className="flex w-full flex-row justify-between">
            <AudioRecorder
              textCallBack={setStudentAudioText}
              shouldDisplayAnswer={shouldDisplayAnswer}
            />
            <div className="flex flex-row gap-x-3">
              <button
                onClick={() => setShouldDisplayAnswer(true)}
                className="h-fit w-fit rounded-lg bg-midBlue px-6 py-1 text-sm text-white"
              >
                {`I Don't Know`}
              </button>
              <button
                onClick={() => checkAnswer()}
                className="h-fit w-fit rounded-lg bg-darkBlue px-6 py-1 text-sm text-white"
                disabled={shouldDisplayAnswer}
              >
                Check
              </button>
            </div>
          </div>
        </div>
      </div>
      {checkAnswerMutation.isLoading || explainAnswerMutation.isLoading ? (
        <Spinner />
      ) : answerExplanation === "" || shouldDisplayAnswer ? (
        <div></div>
      ) : (
        <div className="w-3/4 rounded-lg border border-red-300 px-12 py-5">
          <p>{answerExplanation}</p>
        </div>
      )}
      {shouldDisplayAnswer && (
        <div className="flex w-3/4 flex-col rounded-lg border border-blue-300 px-12 py-5">
          <div className="pb-5 font-bold">Correct Answer</div>
          <div>{card.definition}</div>
          <button
            onClick={handleShowCorrectAnswerAffirmation}
            className="mt-6 h-fit w-fit self-end rounded-lg bg-darkBlue px-6 py-1 text-sm text-white"
          >
            Got It!
          </button>
        </div>
      )}
    </div>
  );
};

export default FlashCard;
