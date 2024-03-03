import { Card, CardBody, Flex, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { type TermDefPair, type CardUpdateParams } from "~/utils/types";
import { api } from "~/utils/api";

const CardPair = ({
  term,
  def,
  idx,
  updateCard,
}: TermDefPair & {
  idx: number;
  updateCard: (props: CardUpdateParams) => void;
}) => {
  const [cardTerm, setCardTerm] = useState(term);
  const [cardDef, setCardDef] = useState(def);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      updateCard({ id: idx, term: cardTerm, def: cardDef });
    }, 3000);

    return () => clearTimeout(delayDebounce);
  }, [cardTerm, cardDef]);

  return (
    <Card w="100%" h="220px" mb={3} borderRadius={3}>
      <Flex justifyContent="space-between">
        <CardBody h="220px" w="40%" className="bg-lightGray" pr={3}>
          <Textarea
            placeholder="Type a term here..."
            wordBreak="break-all"
            value={cardTerm}
            onChange={(e) => setCardTerm(e.target.value)}
            h="100%"
            sx={{ wordWrap: "normal" }}
            backgroundColor="white"
          />
        </CardBody>
        <CardBody w="40%" className="bg-lightGray" pl={3}>
          <Textarea
            placeholder="Type a definition here..."
            wordBreak="break-all"
            value={cardDef}
            onChange={(e) => setCardDef(e.target.value)}
            h="100%"
            overflowWrap="normal"
            backgroundColor="white"
          />
        </CardBody>
      </Flex>
    </Card>
  );
};

export default CardPair;
