import { Card, CheckMode } from "@prisma/client";
import { useState, type FC } from "react";
import { api } from "~/utils/api";
import AudioRecorder from "./AudioRecorder";


interface FlashCardProps {
    card: Card;
    onCorrectCallback?: () => void;
    onIncorrectCallback?: () => void;
    checkMode: CheckMode;
}

const FlashCard: FC<FlashCardProps> = ({ card, onCorrectCallback, onIncorrectCallback, checkMode }) => {
    const [studentInput, setStudentInput] = useState<string>("");
    const checkAnswerMutation = api.gpt.checkAnswer.useMutation({ retry: false });
    const speechToTextMutation = api.gpt.speechToText.useMutation({ retry: false });

    const checkAnswer = () => {
        if (checkMode === CheckMode.AI_CHECK) {
            checkAnswerMutation.mutate({
                term: card.term,
                definition: card.definition,
                studentInput: studentInput
            }, {
                onSuccess: ({ isCorrect }) => {
                    isCorrect ? onCorrectCallback?.() : onIncorrectCallback?.();
                }
            });
        } else {
            studentInput.toLowerCase() === card.definition.toLowerCase() ? onCorrectCallback?.() : onIncorrectCallback?.();
        }
    }

    return (
        <div className="flex flex-row items-center w-screen h-full px-40 justify-between gap-12 text-lg">
            <div className="bg-gray-100 border rounded-lg h-1/3 p-10 flex flex-row items-center justify-center w-full">
                <p>{card.term}</p>
            </div>
            <div className="flex flex-col h-1/3 gap-2 w-full">
                <input type="text"
                    className="border rounded-lg px-10 h-full"
                    value={studentInput}
                    onChange={(e) => setStudentInput(e.target.value)}
                    placeholder="Start typing or press icon to speak." />
                <div className="w-full flex flex-row justify-between">
                    <button
                        onClick={() => speechToTextMutation.mutate({})}
                        className="bg-mediumBlue text-white h-fit rounded-lg px-6 py-1 w-fit text-sm">Speak</button>
                    <AudioRecorder />
                    <button
                        onClick={() => checkAnswer()}
                        className="bg-darkBlue text-white h-fit rounded-lg px-6 py-1 w-fit text-sm">
                        Check
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FlashCard;