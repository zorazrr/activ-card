import { useState } from 'react'; // Import useState hook
import { useRouter } from 'next/router';
import FlashCard from '~/components/Flashcard';
import { api } from '~/utils/api';
import { Icon, Spinner, Tooltip, useToast } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, InfoOutlineIcon } from '@chakra-ui/icons';

const Set = () => {
    const setId = useRouter().query.id;
    const { data: cards } = api.card.geCardBySet.useQuery({ setId: setId as string },
        { enabled: !!setId, retry: false, refetchOnWindowFocus: false });
    const { data: set } = api.set.getOneSet.useQuery({ setId: setId as string }, { enabled: !!setId, retry: false, refetchOnWindowFocus: false });
    const [curIndex, setCurIndex] = useState(0);
    const toast = useToast();

    if (!cards || !set) {
        return <Spinner />;
    }

    const handleCorrectAnswer = () => {
        setCurIndex(curIndex + 1);
        toast({
            title: "That is correct!",
            status: "success",
            duration: 3000,
            isClosable: false,
            position: "top"
        });
    }

    const handleIncorrectAnswer = () => {
        toast({
            title: "Try again!",
            status: "error",
            duration: 3000,
            isClosable: false,
            position: "top"
        });
    }

    return (
        <div className="flex flex-col h-screen w-screen justify-start items-start">
            <p className="w-full text-center pt-8 font-bold">
                {set.name}
                &nbsp;
                <Tooltip label={`Mode: ${set.check_mode}, ${set.answer_mode}`}>
                    <Icon as={InfoOutlineIcon} color="lightgray" />
                </Tooltip>
            </p>
            {
                curIndex >= 0 && curIndex < cards.length ? (
                    <FlashCard
                        key={cards[curIndex]!.id}
                        card={cards[curIndex]!}
                        onCorrectCallback={() => { handleCorrectAnswer() }}
                        onIncorrectCallback={() => { handleIncorrectAnswer() }}
                        checkMode={set?.check_mode} />
                ) : (
                    <div>No card available</div>
                )
            }
            <div className="w-screen flex-col justify-center items-center">
                <p className="text-center font-bold">{curIndex + 1} / {cards.length}</p>
                <div className='flex flex-row justify-between'>
                    <button
                        onClick={() => setCurIndex(curIndex - 1)}
                        disabled={curIndex === 0}
                        className="flex flex-row items-center justify-center p-8">
                        <Icon as={ChevronLeftIcon} />
                        Back
                    </button>
                    <button
                        onClick={() => setCurIndex(curIndex + 1)}
                        disabled={curIndex === cards.length - 1}
                        className="flex flex-row items-center justify-center p-8">
                        Next
                        <Icon as={ChevronRightIcon} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Set;
