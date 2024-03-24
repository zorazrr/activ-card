import { Progress } from "@chakra-ui/react";

const ProgressBar = ({
  percentage,
  shouldApplyMargin = false,
  width,
  shouldApplyBorderRadius,
}: {
  percentage: number;
  shouldApplyMargin?: boolean;
  width?: number;
  shouldApplyBorderRadius?: boolean;
}) => (
  <Progress
    margin={shouldApplyMargin ? "auto" : "inherit"}
    w={width ? `${width}%` : "60%"}
    colorScheme="darkBlue"
    height="28px"
    value={percentage}
    borderRadius={shouldApplyBorderRadius ? 10 : 0}
  />
);

export default ProgressBar;
