import React from "react";
import { Box, Card, CardBody, Divider, HStack, Image } from "@chakra-ui/react";
import { type Set } from "@prisma/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import Link from "next/link";

const SetCard = (props: Partial<Set>) => (
  <Card>
    <CardBody h="100%" paddingY={0} paddingRight={0}>
      <HStack h="220px" w="400px">
        <Box w="80%" minH="100%" pt={5}>
          <p className="h4">{props.name}</p>
          <Divider w="100px" />
          {props.description && (
            <p className="reg-text pt-3">{props.description}</p>
          )}
          <HStack mt="8px">
            <Link href={`/create/set/${props.id}`} key={props.id}>
              <EditIcon />
            </Link>
            <DeleteIcon />
          </HStack>
        </Box>
        <Box w="20%">
          <Image
            src={`https://picsum.photos/seed/${props.name}/400/400`}
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
