import { HStack, Box, Heading, Text, Flex, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DashboardTabs from "~/components/DashboardTabs";
import Sidebar from "~/components/SideBar/SideBar";
import { api } from "~/utils/api";
import { Role, type Classroom } from "@prisma/client";
import { useSession } from "next-auth/react";
import ProtectedPage from "~/components/ProtectedPage";
import { AddIcon } from "@chakra-ui/icons";

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [currentClass, setCurrentClass] = useState<Classroom | null>(null);
  const teacherId = session?.user?.id;
  const { data } = api.teacher.getTeacherAndClassrooms.useQuery(
    {
      teacherId: teacherId!,
    },
    {
      onSuccess: (res) => {
        if (res) {
          setClassrooms(res?.classroom as Classroom[]);
          setCurrentClass(res?.classroom[0]);
        }
      },
      enabled: !!teacherId,
      refetchOnWindowFocus: false,
      retry: false,
    },
  );

  return (
    <ProtectedPage requiredRole={Role.TEACHER}>
      <HStack height="100%" className="main-class min-h-screen">
        {classrooms && (
          <Sidebar classes={classrooms} setCurrentClass={setCurrentClass} />
        )}
        {classrooms.length ? (
          <>
            {" "}
            <Box
              w="full"
              h="100%"
              pt={16}
              pl={10}
              style={{ overflowY: "scroll" }}
            >
              <Text className="h3 leading-9 text-darkBlue">Welcome to</Text>
              <Text className="h3 text-mediumBlue">{currentClass?.name}</Text>
              <DashboardTabs currentClass={currentClass} />
            </Box>
          </>
        ) : (
          <Flex
            w="full"
            h="100%"
            direction="column"
            align="center"
            justify="center"
            style={{ overflowY: "scroll" }}
            gap={8} // Adjust the value as needed for your design
          >
            <IconButton
              borderRadius={20}
              variant="outline"
              aria-label="Add card"
              fontSize="50px"
              bg={"gray.200"}
              icon={<AddIcon color="blue.900" />}
              _hover={{ bg: "gray.300", borderColor: "gray.300" }}
              p={20}
            />
            <Text className="h3 leading-9 text-darkBlue" textAlign="center">
              Add Class To Get Started
            </Text>
          </Flex>
        )}
      </HStack>
    </ProtectedPage>
  );
}
