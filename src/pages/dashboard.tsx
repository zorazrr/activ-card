import { HStack, Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DashboardTabs from "~/components/DashboardTabs";
import Sidebar from "~/components/SideBar/SideBar";
import { api } from "~/utils/api";
import { Role, type Classroom } from "@prisma/client";
import { useSession } from "next-auth/react";
import ProtectedPage from "~/components/ProtectedPage";

export default function TeacherDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>();
  const [currentClass, setCurrentClass] = useState<Classroom>();
  const { data } = api.teacher.getTeacherAndClassrooms.useQuery(
    {
      teacherId: "65e02d8dc28288af3137635d",
    },
    {
      onSuccess: (data) => {
        setClassrooms(data.classroom as Classroom[]);
        setCurrentClass(data.classroom[0]);
      },
    },
  );

  // useEffect(() => {
  //   session ? console.log("You are logged in as:", session?.user?.email) : window.location.href = "/login";
  // }, [session])

  // useEffect(() => {
  //   if (classrooms) {
  //     console.log(classrooms);
  //     setCurrentClass(classrooms[0]);
  //   }
  // }, [classrooms, currentClass, data]);

  // const classes = [
  //   { className: "English" },
  //   { className: "Math" },
  //   { className: "Science" },
  // ] as Class[];
  // setCurrentClass(classrooms[0]);

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
