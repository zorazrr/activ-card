import { useState } from 'react'; // Import useState hook
import { useRouter } from 'next/router';
import FlashCard from '~/components/Flashcard';
import { api } from '~/utils/api';
import { Icon } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';

const Set = () => {
    const setId = useRouter().query.id;
    const { data: cards } = api.card.geCardBySet.useQuery({ setId: setId as string },
        { enabled: !!setId, retry: false, refetchOnWindowFocus: false });

    // State to keep track of the current index
    const [curIndex, setCurIndex] = useState(0);

    if (!cards) {
        return <div>Loading...</div>;
    }

    // Check if cards array is not empty and curIndex is within bounds
    const isValidIndex = curIndex >= 0 && curIndex < cards.length;

    return (
        <div className="flex flex-col h-screen w-screen justify-start items-start">
            {
                isValidIndex ? (
                    <FlashCard key={cards[curIndex]!.id} card={cards[curIndex]!} />
                ) : (
                    <div>No card available</div>
                )
            }
            <div className="w-screen flex-col justify-center items-center">
                <p className="text-center">{curIndex} / {cards.length}</p>
                <button
                    onClick={() => setCurIndex(curIndex - 1)}
                    disabled={curIndex === 0}
                    className="flex flex-row items-center justify-center p-8">
                    <Icon as={ChevronLeftIcon} />
                    Back
                </button>
            </div>
        </div>
    );
}

export default Set;
