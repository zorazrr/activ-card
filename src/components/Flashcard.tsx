import type { Card } from "@prisma/client";
import { useState, type FC } from "react";


interface FlashCardProps {
    card: Card;
    onCorrectCallback?: () => void;
    onIncorrectCallback?: () => void;
}

const FlashCard: FC<FlashCardProps> = ({ card, onCorrectCallback, onIncorrectCallback }) => {
    const [studentInput, setStudentInput] = useState<string>("");

    const checkAnswer = () => {
        // TODO: Implement logic to check if studentInput is correct
        Math.random() > 0.5 ? onCorrectCallback?.() : onIncorrectCallback?.();
    }

    return (
        <div className="flex flex-row items-center w-screen h-full px-40 justify-between gap-12">
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
                    <button className="bg-mediumBlue text-white h-fit rounded-lg px-6 py-1 w-fit">Speak</button>
                    <button
                        onClick={() => checkAnswer()}
                        className="bg-darkBlue text-white h-fit rounded-lg px-6 py-1 w-fit">
                        Check
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FlashCard;