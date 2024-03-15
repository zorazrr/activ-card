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
import { Classroom, Student } from "@prisma/client";
import { useSession } from "next-auth/react";

const StudentRoster = ({
  currentClass,
}: {
  currentClass: Classroom | undefined | null;
}) => {
  const { data: session, status } = useSession();

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
            {currentClass?.students.map((student: Student) => (
              <>
                <Tr key={student.name}>
                  <Td>{student.name}</Td>
                  <Td>{student.email}</Td>
                  <Td>
                    <HStack gap={4}>
                      {/* <EditIcon w={8} h={8} color="darkGray" /> */}
                      {/* <DeleteIcon w={8} h={8} color="darkGray" /> */}
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
