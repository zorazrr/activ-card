import { Progress } from "@chakra-ui/react";

const ProgressBar = ({
  percentage,
  shouldApplyMargin = false,
}: {
  percentage: number;
  shouldApplyMargin?: boolean;
}) => (
  <Progress
    margin={shouldApplyMargin ? "auto" : "inherit"}
    w="60%"
    colorScheme="darkBlue"
    height="28px"
    value={percentage}
    borderRadius={10}
  />
);

export default ProgressBar;
