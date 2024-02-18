import { Progress } from "@chakra-ui/react";

const ProgressBar = ({ percentage }: { percentage: number }) => (
  <Progress
    w="60%"
    colorScheme="darkBlue"
    height="28px"
    value={percentage}
    borderRadius={10}
  />
);

export default ProgressBar;
