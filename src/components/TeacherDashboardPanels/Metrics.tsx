import {
  Box,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  ListItem,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  UnorderedList,
  VStack,
  Text,
} from "@chakra-ui/react";
import ProgressMetric from "../Progress/ProgressMetric";
import { useState } from "react";

const Metrics = () => {
  const students = [
    {
      name: "Alice Lara",
      insight:
        "Struggling with understanding the causes of the American Revolution.",
    },
    {
      name: "David Zhang",
      insight: "Responding with one-word answers.",
    },
    {
      name: "Eva Franz",
      insight: "Heavy use of Ctrl+C keyboard shortcut.",
    },
    {
      name: "Grace Todd",
      insight: "Struggling to comprehend most definitions in set.",
    },
  ];
  const [selectedOption, setSelectedOption] = useState("option1");

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <VStack w="100%" align="start" pl={3} pr={3} overflowY={"auto"}>
      <HStack justifyContent="space-between" w="100%" mb={3}>
        <p className="h4 my-2 text-darkBlue">Overview</p>
        <Select
          w="20%"
          bg={"white"}
          color={"darkBlue.500"}
          value={selectedOption}
          onChange={handleSelectChange}
          placeholder="Select Set"
        >
          <option value="option1">Revolutionary War</option>
          <option value="option4">Life Science</option>
          <option value="option5">Three States of Matter</option>
        </Select>
      </HStack>

      {selectedOption === "" ? (
        <Box>Select a Set to Run Metrics</Box>
      ) : (
        <>
          <HStack justifyContent="space-between" w="100%" gap={4}>
            <HStack
              gap={3}
              maxW="30%"
              backgroundColor={"white"}
              pt={4}
              pb={4}
              pl={6}
              pr={6}
              borderRadius={10}
            >
              <p className="h5 my-2 text-darkBlue">Completion Rate</p>
              <CircularProgress value={50} color="mediumBlue.500" size="150px">
                <CircularProgressLabel>50%</CircularProgressLabel>
              </CircularProgress>
            </HStack>
            <HStack
              gap={3}
              maxW="30%"
              backgroundColor={"white"}
              pt={4}
              pb={4}
              pl={6}
              pr={6}
              borderRadius={10}
            >
              <p className="h5 my-2 text-darkBlue">Average Score</p>
              <CircularProgress value={85} color="darkBlue.500" size="150px">
                <CircularProgressLabel>85%</CircularProgressLabel>
              </CircularProgress>
            </HStack>
            <HStack
              gap={3}
              maxW="30%"
              backgroundColor={"white"}
              pt={4}
              pb={4}
              pl={6}
              pr={6}
              borderRadius={10}
            >
              <p className="h5 my-2 text-darkBlue">Initial Accuracy Rate</p>
              <CircularProgress value={33} color="midBlue.500" size="150px">
                <CircularProgressLabel>33%</CircularProgressLabel>
              </CircularProgress>
            </HStack>
          </HStack>
          <p className="h4  my-2 text-darkBlue">Card Statistics</p>
          <p className="h5  my-2 text-darkBlue">Strongest Cards</p>
          <HStack gap={5} width="100%">
            <Box
              backgroundColor={"white"}
              h="20vh"
              w="40%"
              borderRadius={10}
              borderColor={"green.200"}
              borderWidth={2}
              p={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div>How did the Revolutionary War end?</div>
            </Box>
            <Box
              backgroundColor={"white"}
              h="20vh"
              w="40%"
              borderRadius={10}
              borderColor={"green.200"}
              borderWidth={2}
              p={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div>Why did the Revolutionary War start?</div>
            </Box>
            <Box
              backgroundColor={"white"}
              h="20vh"
              w="40%"
              borderRadius={10}
              borderColor={"green.200"}
              borderWidth={2}
              p={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div>Who were two fighting sides?</div>
            </Box>
          </HStack>
          <p className="h5  my-2 text-darkBlue">Weakest Cards</p>
          <HStack gap={5} width="100%">
            <Box
              backgroundColor={"white"}
              h="20vh"
              w="40%"
              borderRadius={10}
              borderColor={"red.200"}
              borderWidth={2}
              p={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div>What is the role of George Washington in this war?</div>
            </Box>
            <Box
              backgroundColor={"white"}
              h="20vh"
              w="40%"
              borderRadius={10}
              borderColor={"red.200"}
              borderWidth={2}
              p={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div>Who fought in this war?</div>
            </Box>
            <Box
              backgroundColor={"white"}
              h="20vh"
              w="40%"
              borderRadius={10}
              borderColor={"red.200"}
              borderWidth={2}
              p={6}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <div>
                Can you name and explain one of the battles in this war?
              </div>
            </Box>
          </HStack>
          <p className="h4 my-2 text-darkBlue">Student Statistics</p>

          <p className="h5 my-2 text-darkBlue">Group Insight</p>
          <Box
            backgroundColor={"blue.50"}
            h="20vh"
            w="100%"
            borderColor={"darkBlue.500"}
            borderWidth={1}
            borderRadius={10}
            p={6}
          >
            <Text>
              The students collectively seem to have a{" "}
              <b>strong understanding</b> of the <b>overall timeline</b> of the
              <b> Revolutionary War</b> but are struggling in the following
              areas:
            </Text>
            <br></br>
            <UnorderedList>
              <ListItem pb={2}>
                Confusing Declaration of Independence with Constitution
              </ListItem>
              <ListItem pb={2}>
                Understanding the role of Thomas Jefferson and Thomas Paine
              </ListItem>
            </UnorderedList>
          </Box>
          <p className="h5 my-2 text-darkBlue">Student Attention</p>
          <Box
            borderWidth={1}
            borderColor={"darkBlue.500"}
            backgroundColor={"white"}
            borderRadius={10}
            w="100%"
            mb={20}
          >
            {/* <TableContainer
              w="100%"
              borderWidth={1}
              borderColor={"darkBlue.500"}
              backgroundColor={"white"}
              borderRadius={10}
            > */}
            <Table w="100%" variant="simple" colorScheme="darkBlue">
              <Thead>
                <Tr>
                  <Th w="45%">Name</Th>
                  <Th w="45%">Insights</Th>
                </Tr>
              </Thead>
              <Tbody>
                {students.map((student) => (
                  <>
                    <Tr key={student.name}>
                      <Td>
                        <b>{student.name}</b>
                      </Td>
                      <Td>{student.insight}</Td>
                    </Tr>
                  </>
                ))}
              </Tbody>
            </Table>
            {/* </TableContainer> */}
          </Box>
        </>
      )}
    </VStack>
  );
};

export default Metrics;
