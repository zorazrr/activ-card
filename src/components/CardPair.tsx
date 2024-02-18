import { Card, CardBody, Divider, Flex, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { type TermDefPair } from "~/utils/types";

const CardPair = ({ term, def }: TermDefPair) => {
  const [cardTerm, setCardTerm] = useState(term);
  const [cardDef, setCardDef] = useState(def);

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
