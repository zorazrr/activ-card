import { VStack } from "@chakra-ui/react";
import ProgressBar from "../Progress/ProgressBar";
import ProgressMetric from "../Progress/ProgressMetric";
import { Card, Student } from "@prisma/client";
import { useState } from "react";

const Metrics = () => {
  return (
    <VStack w="100%" align="start">
      <p className="h4 my-2">Overview</p>
      <ProgressMetric label="Students Finished" percentage={40} />
      <ProgressMetric label="Average Score" percentage={85} />
      <p className="h4  my-2">Card Statistics</p>
      <ProgressMetric
        label="Card 1: Describe the effects of World War II"
        percentage={80}
      />
      <ProgressMetric
        label="Card 2: What was America's main priority during the war?"
        percentage={85}
      />
      <ProgressMetric
        label="Card 3: What was Eisenhower's stance on the war?"
        percentage={90}
      />
      <ProgressMetric
        label="Card 4: What were some economical effects of WWII?"
        percentage={100}
      />
      <ProgressMetric
        label="Card 5: Explain how women's rights advanced or regressed during this time"
        percentage={70}
      />
      <p className="h4 my-2">Student Progress</p>
      <ProgressMetric label="Vasu Chalasani" percentage={100} />
      <ProgressMetric label="Zora Zhang" percentage={100} />
      <ProgressMetric label="Archna Sobti" percentage={100} />
      <ProgressMetric label="Alice" percentage={0} />
      <ProgressMetric label="Bob" percentage={0} />
      <ProgressMetric label="Charlie" percentage={0} />
      <ProgressMetric label="David" percentage={0} />
      <ProgressMetric label="Eva" percentage={0} />
      <ProgressMetric label="Frank" percentage={0} />
      <ProgressMetric label="Grace" percentage={0} />
      <ProgressMetric label="Henry" percentage={0} />
      <ProgressMetric label="Ivy" percentage={0} />
    </VStack>
  );
};

export default Metrics;
