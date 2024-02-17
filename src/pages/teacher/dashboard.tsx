import { HStack, Box, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";
import SetCard from "~/components/Card";
import DashboardTabs from "~/components/DashboardTabs";
import Sidebar from "~/components/SideBar/SideBar";

interface Class {
  className: string;
}

export default function TeacherDashboard() {
  const classes = [
    { className: "English" },
    { className: "Math" },
    { className: "Science" },
  ] as Class[];

  const [currentClass, setCurrentClass] = useState(classes[0]);

  return (
    <HStack height="100%" className="main-class min-h-screen">
      <Sidebar classes={classes} setCurrentClass={setCurrentClass} />
      <Box w="full" h="100%" pt={16} pl={10} style={{ overflowY: "scroll" }}>
        <Text className="h3 text-darkBlue leading-9">Welcome to</Text>
        <Text className="h3 text-mediumBlue">{currentClass?.className}</Text>
        <DashboardTabs />
      </Box>
    </HStack>
  );
}
