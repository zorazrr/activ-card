import React from "react";
import { Box, Card, CardBody, Divider, HStack, Image } from "@chakra-ui/react";

const SetCard = ({
  setName,
  imageSrc,
  className,
}: {
  setName: string;
  imageSrc: string;
  className?: string;
}) => (
  <Card>
    <CardBody h="100%" paddingY={0} paddingRight={0}>
      <HStack h="220px" w="400px">
        <Box w="80%" minH="100%" pt={5}>
          <p className="h4">{setName}</p>
          <Divider w="100px" />
          {className && <p className="reg-text pt-3">{className}</p>}
        </Box>
        <Box w="20%">
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
