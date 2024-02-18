import { HStack, Box, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import DashboardTabs from "~/components/DashboardTabs";
import Sidebar from "~/components/SideBar/SideBar";
import { api } from "~/utils/api";
import { type Classroom } from "@prisma/client";
import { useSession } from "next-auth/react";

export default function TeacherDashboard() {
  const [classrooms, setClassrooms] = useState<Classroom[]>();
  const [currentClass, setCurrentClass] = useState<Classroom>();
  // const { data: session } = useSession();
  // console.log(session);
  const { data } = api.teacher.getTeacherAndClassrooms.useQuery(
    {
      teacherId: "65d1242ccdde4a764731c37f",
    },
    {
      onSuccess: (data) => {
        setClassrooms(data.classroom as Classroom[]);
        setCurrentClass(data.classroom[0]);
      },
    },
  );


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
  );
}
