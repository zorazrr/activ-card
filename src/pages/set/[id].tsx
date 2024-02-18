import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Set = () => {
    const setId = useRouter().query.id;
    const { data: cards } = api.card.geCardBySet.useQuery({ setId: setId as string }, { enabled: !!setId, retry: false });

    return (
        <div>
            {
                cards?.map((card) => (
                    <div key={card.id}>
                        <p className="text-lg">{card.term}</p>
                        <p>{card.definition}</p>
                    </div>
                ))
            }
        </div>
    )
}

export default Set;