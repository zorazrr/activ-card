import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import Sets from "./TeacherDashboardPanels/Sets";
import Students from "./TeacherDashboardPanels/Students";
import Metrics from "./TeacherDashboardPanels/Metrics";

const DashboardTabs = () => (
  <Tabs variant="enclosed" pt={5}>
    <TabList>
      <Tab>Sets</Tab>
      <Tab>Students</Tab>
      <Tab>Metrics</Tab>
    </TabList>
    <TabPanels>
      <TabPanel overflowY="scroll">
        <Sets />
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

export default DashboardTabs;
