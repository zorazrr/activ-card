import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
} from "@chakra-ui/react";

const StudentRoster = () => {
  // mock students
  const students = [
    { name: "Alice Lara", email: "alice@gmail.com" },
    { name: "Archna Sobti", email: "archna@gmail.com" },
    { name: "Bob Kinsey", email: "bob@gmail.com" },
    { name: "Charlie McIntosh", email: "charlie@gmail.com" },
    { name: "David Zhang", email: "david@gmail.com" },
    { name: "Eva Franz", email: "eva@gmail.com" },
    { name: "Frank Evans", email: "frank@gmail.com" },
    { name: "Grace Todd", email: "grace@gmail.com" },
    { name: "Henry Cavill", email: "henry@gmail.com" },
    { name: "Ivy June", email: "ivy@gmail.com" },
    { name: "Vasu Chalasani", email: "vasu@gmail.com" },
    { name: "Zora Zhang", email: "zora@gmail.com" },
  ];

  return (
    <div>
      <TableContainer>
        <Table variant="striped" colorScheme="darkBlue">
          <Thead>
            <Tr>
              <Th w="45%">Name</Th>
              <Th w="45%">Email</Th>
              <Th w="10%"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <>
                <Tr key={student.name}>
                  <Td>{student.name}</Td>
                  <Td>{student.email}</Td>
                  <Td>
                    <HStack gap={4}>
                      <EditIcon w={8} h={8} color="darkGray" />
                      <DeleteIcon w={8} h={8} color="darkGray" />
                    </HStack>
                  </Td>
                </Tr>
              </>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StudentRoster;
