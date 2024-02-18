import React from "react";
import { Box, Card, CardBody, Divider, HStack, Icon } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const CardNew = () => (
    <Card backgroundColor="gray.100">
        <CardBody h="100%" paddingY={0} paddingRight={0} color="gray.600">
            <HStack h="220px" w="400px">
                <Box w="80%" minH="100%" pt={5}>
                    <p className="h4">Create New Set</p>
                    <Divider w="100px" />
                </Box>
                <Icon as={AddIcon} w={8} h={8} />
            </HStack>
        </CardBody>
    </Card>
);

export default CardNew;
