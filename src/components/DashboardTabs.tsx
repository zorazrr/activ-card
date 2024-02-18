import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import Sets from "./TeacherDashboardPanels/Sets";
import Students from "./TeacherDashboardPanels/Students";
import Metrics from "./TeacherDashboardPanels/Metrics";
import { type Classroom } from "@prisma/client";

const DashboardTabs = ({
  currentClass,
}: {
  currentClass: Classroom | undefined;
}) => {
  console.log(currentClass);
  console.log("if the aboe thing is undefined, be sad");
  return (
    <Tabs variant="enclosed" pt={5}>
      <TabList>
        <Tab>Sets</Tab>
        <Tab>Students</Tab>
        <Tab>Metrics</Tab>
      </TabList>
      <TabPanels>
        <TabPanel overflowY="scroll">
          <Sets currentClass={currentClass} />
        </TabPanel>
        <TabPanel overflowY="scroll">
          <Students />
        </TabPanel>
        <TabPanel overflowY="scroll">
          <Metrics />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default DashboardTabs;
