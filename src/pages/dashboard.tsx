import { HStack, Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DashboardTabs from "~/components/DashboardTabs";
import Sidebar from "~/components/SideBar/SideBar";
import { api } from "~/utils/api";
import { Role, type Classroom } from "@prisma/client";
import { useSession } from "next-auth/react";
import ProtectedPage from "~/components/ProtectedPage";

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
        <Box w="full" h="100%" pt={16} pl={10} style={{ overflowY: "scroll" }}>
          <Text className="h3 leading-9 text-darkBlue">Welcome to</Text>
          <Text className="h3 text-mediumBlue">{currentClass?.name}</Text>
          <DashboardTabs currentClass={currentClass} />
        </Box>
      </HStack>
    </ProtectedPage>
  );
}
