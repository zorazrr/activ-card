import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import Sets from "./TeacherDashboardPanels/Sets";
import StudentRoster from "./TeacherDashboardPanels/StudentRoster";
import Metrics from "./TeacherDashboardPanels/Metrics";
import { Role, type Classroom } from "@prisma/client";

const DashboardTabs = ({
  currentClass,
  accountType,
}: {
  currentClass: Classroom | null | undefined;
  accountType: Role | undefined;
}) => {
  return (
    <Tabs variant="enclosed" pt={5}>
      <TabList>
        <Tab>Sets</Tab>
        <Tab>Badges</Tab>
        {accountType && accountType == Role.TEACHER && (
          <>
            <Tab>Students</Tab>
            <Tab>Metrics</Tab>
          </>
        )}
      </TabList>
      <TabPanels>
        <TabPanel overflowY="scroll">
          <Sets accountType={accountType} currentClass={currentClass} />
        </TabPanel>
        <TabPanel overflowY="scroll"></TabPanel>
        {accountType && accountType == Role.TEACHER && (
          <TabPanel overflowY="scroll">
            <StudentRoster currentClass={currentClass} />
          </TabPanel>
        )}
        {accountType && accountType == Role.TEACHER && (
          <TabPanel overflowY="scroll">
            <Metrics />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
  );
};

export default DashboardTabs;
