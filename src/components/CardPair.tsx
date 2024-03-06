import { Card, CardBody, Flex, IconButton, Textarea } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  type TermDefPair,
  type CardUpdateParams,
  type CardRemoveParams,
} from "~/utils/types";
import { api } from "~/utils/api";
import { DeleteIcon } from "@chakra-ui/icons";

const CardPair = ({
  term,
  def,
  idx,
  updateCard,
  removeCard,
}: TermDefPair & {
  idx: number;
  updateCard: (props: CardUpdateParams) => void;
  removeCard: (props: CardRemoveParams) => void;
}) => {
  const [cardTerm, setCardTerm] = useState(term);
  const [cardDef, setCardDef] = useState(def);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      updateCard({ id: idx, term: cardTerm, def: cardDef });
    }, 1000);

    return () => clearTimeout(delayDebounce);
  }, [cardTerm, cardDef]);

  return (
    <Card w="100%" mb={5} borderRadius={3}>
      <Flex className="bg-lightGray" flexDirection={"column"} height="25vh">
        <Flex justifyContent="space-between" h="100%">
          <CardBody w="40%" pr={2} pb={0}>
            <Textarea
              placeholder="Type a term here..."
              wordBreak="break-all"
              value={cardTerm}
              onChange={(e) => setCardTerm(e.target.value)}
              h="95%"
              sx={{ wordWrap: "normal" }}
              backgroundColor="white"
            />
          </CardBody>
          <CardBody w="40%" pl={2} pb={0}>
            <Textarea
              placeholder="Type a definition here..."
              wordBreak="break-all"
              value={cardDef}
              onChange={(e) => setCardDef(e.target.value)}
              h="95%"
              overflowWrap="normal"
              backgroundColor="white"
            />
          </CardBody>
        </Flex>
        <div style={{ margin: "auto", marginBottom: "0.5vh" }}>
          <IconButton
            variant="outline"
            aria-label="Delete card"
            backgroundColor={"#4A729D"}
            icon={<DeleteIcon color="white" />}
            onClick={() => removeCard({ id: idx })}
            size={"md"}
            _hover={{
              opacity: 0.75,
            }}
          />
        </div>
      </Flex>
    </Card>
  );
};

export default CardPair;
