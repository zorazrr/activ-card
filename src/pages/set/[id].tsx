import { Card } from "@prisma/client";
import { useRouter } from "next/router";
import FlashCard from "~/components/Flashcard";
import { api } from "~/utils/api";

const Set = () => {
    const setId = useRouter().query.id;
    const { data: cards } = api.card.geCardBySet.useQuery({ setId: setId as string },
        { enabled: !!setId, retry: false, refetchOnWindowFocus: false });

    if (!cards) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <FlashCard card={cards[0]!} />
        </div>
    )
}

export default Set;