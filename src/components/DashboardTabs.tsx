import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import Sets from "./TeacherDashboardPanels/Sets";
import StudentRoster from "./TeacherDashboardPanels/StudentRoster";
import Metrics from "./TeacherDashboardPanels/Metrics";
import BadgeGallery from "./BadgeGallery";
import { Role, type Classroom } from "@prisma/client";

const DashboardTabs = ({
  currentClass,
  accountType,
}: {
  currentClass: Classroom | null | undefined;
  accountType: Role | undefined;
}) => {
  return (
    <Tabs
      variant="enclosed"
      pt={5}
      height="80vh"
      overflow="hidden"
      w="calc(100% - 2.5rem)"
    >
      <TabList pb={5}>
        <Tab>Sets</Tab>
        {accountType && accountType == Role.TEACHER && (
          <>
            <Tab>Metrics</Tab>
            <Tab>Students</Tab>
          </>
        )}
        <Tab>Badges</Tab>
      </TabList>
      <TabPanels
        height="100%"
        overflowY="auto"
        backgroundColor={"lightGray.500"}
        borderTopWidth={"0.5vh"}
        borderColor={"lightGray.500"}
      >
        <TabPanel>
          <Box pb={50}>
            <Sets accountType={accountType} currentClass={currentClass} />
          </Box>
        </TabPanel>
        {accountType && accountType == Role.TEACHER && (
          <TabPanel>
            <Metrics />
          </TabPanel>
        )}
        {accountType && accountType == Role.TEACHER && (
          <TabPanel>
            <StudentRoster currentClass={currentClass} />
          </TabPanel>
        )}
        <TabPanel>
          <BadgeGallery currentClass={currentClass} />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DashboardTabs;
