import React from "react";
import {
  Box,
  Card,
  CardBody,
  Divider,
  HStack,
  IconButton,
  Image,
  VStack,
} from "@chakra-ui/react";
import { type Set } from "@prisma/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

interface SetCardProps extends Partial<Set> {
  deleteSet: any; // TODO: Fix this
}

const SetCard = (props: SetCardProps) => (
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
            <EditIcon />

            <IconButton
              variant="outline"
              aria-label="Delete card"
              bg={"gray.200"}
              icon={<DeleteIcon color="blue.900" />}
              _hover={{ bg: "gray.300", borderColor: "gray.300" }}
              onClick={() => props?.deleteSet?.mutate({ setId: props.id })}
            />
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
