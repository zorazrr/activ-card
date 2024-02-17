import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";

const DashboardTabs = () => {
  <Tabs>
    <TabList>
      <Tab>Sets</Tab>
      <Tab>Students</Tab>
      <Tab>Metrics</Tab>
    </TabList>
    <TabPanels>
      <TabPanel>
        <p>one!</p>
      </TabPanel>
      <TabPanel>
        <p>two!</p>
      </TabPanel>
      <TabPanel>
        <p>three!</p>
      </TabPanel>
    </TabPanels>
  </Tabs>;
};
