import {
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import ProgressMetric from "../Progress/ProgressMetric";

const Metrics = () => {
  const students = [
    {
      name: "Alice Lara",
      insight:
        "Struggling with understanding the causes of the American Revolution.",
    },
    {
      name: "David Zhang",
      insight: "Needs help grasping the intricacies of the Civil War.",
    },
    {
      name: "Eva Franz",
      insight: "Having difficulty with the concept of Manifest Destiny.",
    },
    {
      name: "Grace Todd",
      insight:
        "Struggling to comprehend the economic factors leading to the Great Depression.",
    },
    {
      name: "Henry Cavill",
      insight:
        "Finding it challenging to understand the impact of World War II on the United States.",
    },
  ];

  return (
    <VStack w="100%" align="start">
      <HStack justifyContent="space-between" w="75%" mb={3}>
        <p className="h4 my-2">Overview</p>
        <Select w="20%" placeholder="Unit 1" bg={"white"} />
      </HStack>

      <HStack justifyContent="space-between" w="75%" gap={5}>
        <HStack gap={0} maxW="30%">
          <p className="h5 font-normal">Completion Rate</p>
          <CircularProgress value={40} color="mediumBlue.500" size="150px">
            <CircularProgressLabel>40%</CircularProgressLabel>
          </CircularProgress>
        </HStack>
        <HStack gap={0} maxW="30%">
          <p className="h5 font-normal">Average Score</p>
          <CircularProgress value={85} color="darkBlue.500" size="150px">
            <CircularProgressLabel>85%</CircularProgressLabel>
          </CircularProgress>
        </HStack>
        <HStack gap={1} maxW="30%">
          <p className="h5 font-normal">Initial Accuracy Rate</p>
          <CircularProgress value={20} color="midBlue.500" size="150px">
            <CircularProgressLabel>20%</CircularProgressLabel>
          </CircularProgress>
        </HStack>
      </HStack>
      <p className="h4  my-2">Card Statistics</p>
      <ProgressMetric
        label="Card 1: Describe the effects of World War II"
        percentage={80}
      />
      <ProgressMetric
        label="Card 2: What was America's main priority during the war?"
        percentage={85}
      />
      <ProgressMetric
        label="Card 3: What was Eisenhower's stance on the war?"
        percentage={90}
      />
      <ProgressMetric
        label="Card 4: What were some economical effects of WWII?"
        percentage={100}
      />
      <ProgressMetric
        label="Card 5: Explain how women's rights advanced or regressed during this time"
        percentage={70}
      />
      <p className="h4 my-2">Students Needing Help</p>

      <TableContainer w="75%">
        <Table w="100%" variant="striped" colorScheme="darkBlue">
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
                  <Td>{student.name}</Td>
                  <Td>{student.insight}</Td>
                </Tr>
              </>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <p className="h4 my-2">Student Progress</p>
      <ProgressMetric label="Vasu Chalasani" percentage={100} />
      <ProgressMetric label="Zora Zhang" percentage={100} />
      <ProgressMetric label="Archna Sobti" percentage={100} />
      <ProgressMetric label="Alice" percentage={0} />
      <ProgressMetric label="Bob" percentage={0} />
      <ProgressMetric label="Charlie" percentage={0} />
      <ProgressMetric label="David" percentage={0} />
      <ProgressMetric label="Eva" percentage={0} />
      <ProgressMetric label="Frank" percentage={0} />
      <ProgressMetric label="Grace" percentage={0} />
      <ProgressMetric label="Henry" percentage={0} />
      <ProgressMetric label="Ivy" percentage={0} />
    </VStack>
  );
};

export default Metrics;
