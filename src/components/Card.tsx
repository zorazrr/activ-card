import React from "react";
import { Box, Card, CardBody, Divider, HStack, Image } from "@chakra-ui/react";
import { type Set } from "@prisma/client";

const SetCard = (props: Partial<Set>) => (
  <Card>
    <CardBody h="100%" paddingY={0} paddingRight={0}>
      <HStack h="220px" w="400px">
        <Box w="80%" minH="100%" pt={5}>
          <p className="h4">{props.name}</p>
          <Divider w="100px" />
          {props.name && <p className="reg-text pt-3">{props.description}</p>}
        </Box>
        <Box w="20%">
          <Image
            src="https://gizmodo.com.au/wp-content/uploads/2023/01/25/google-reverse-image-search.png?quality=75"
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
