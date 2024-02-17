import React from "react";
import { Box, Card, CardBody, HStack, Image } from "@chakra-ui/react";

const SetCard = ({
  setName,
  imageSrc,
}: {
  setName: string;
  imageSrc: string;
}) => (
  <Card>
    <CardBody h="100%" paddingY={0} paddingRight={0}>
      <HStack h="100%">
        <Box minW="80%">
          <p className="h4-size">{setName}</p>
        </Box>
        <Box minW="20%">
          <Image
            src={imageSrc}
            alt="Set cover image"
            objectFit="cover"
            w="100%"
            h="220px"
            borderTopRightRadius="md"
            borderBottomRightRadius="md"
          />
        </Box>
      </HStack>
    </CardBody>
  </Card>
);

export default SetCard;
