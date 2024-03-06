import React from "react";
import { Box, Card, CardBody, Divider, HStack, Image } from "@chakra-ui/react";
import { type Set } from "@prisma/client";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

const SetCard = (props: Partial<Set>) => {
  const onEdit = () => {
    window.location.href = `/create/set/${props.id}?isEdit=true`;
  };

  const onStudy = () => {
    window.location.href = `/set/${props.id}`;
  };

  return (
    <Card>
      <CardBody h="100%" paddingY={0} paddingRight={0} onClick={onStudy}>
        <HStack h="220px" w="400px">
          <Box w="80%" minH="100%" pt={5}>
            <p className="h4">{props.name}</p>
            <Divider w="100px" />
            {props.description && (
              <p className="reg-text pt-3">{props.description}</p>
            )}
            <HStack mt="8px">
              <EditIcon onClick={onEdit} />
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
};

export default SetCard;
