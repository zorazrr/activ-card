import { type Card, CheckMode, AnswerMode } from "@prisma/client";
import { use, useEffect, useState, type FC } from "react";
import { api } from "~/utils/api";
import AudioRecorder from "./AudioRecorder";

interface FlashCardProps {
  card: Card;
  onCorrectCallback?: () => void;
  onIncorrectCallback?: () => void;
  checkMode: CheckMode;
  answerMode: AnswerMode;
}

const FlashCard: FC<FlashCardProps> = ({
  card,
  onCorrectCallback,
  onIncorrectCallback,
  checkMode,
  answerMode,
}) => {
  const [studentInput, setStudentInput] = useState<string>("");
  const [studentAudioText, setStudentAudioText] = useState<string>();
  const checkAnswerMutation = api.gpt.checkAnswer.useMutation({ retry: false });

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
            isCorrect ? onCorrectCallback?.() : onIncorrectCallback?.();
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
            isCorrect ? onCorrectCallback?.() : onIncorrectCallback?.();
          },
        },
      );
    }
  };

  useEffect(() => {
    if (studentAudioText !== undefined) {
      checkAnswer();
      setStudentInput(studentAudioText);
      setStudentAudioText(undefined);
    }
  }, [studentAudioText]);

  return (
    <div className="flex h-full w-screen flex-row items-center justify-between gap-12 px-40 text-lg">
      <div className="flex h-1/3 w-full flex-row items-center justify-center rounded-lg border bg-gray-100 p-10">
        <p>{card.term}</p>
      </div>
      <div className="flex h-1/3 w-full flex-col gap-2">
        <input
          type="text"
          className="h-full rounded-lg border px-10"
          value={studentInput}
          onChange={(e) => setStudentInput(e.target.value)}
          placeholder="Start typing or press icon to speak."
        />
        <div className="flex w-full flex-row justify-between">
          <AudioRecorder textCallBack={setStudentAudioText} />
          <button
            onClick={() => checkAnswer()}
            className="h-fit w-fit rounded-lg bg-darkBlue px-6 py-1 text-sm text-white"
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
