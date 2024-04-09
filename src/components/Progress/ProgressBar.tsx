import { Progress } from "@chakra-ui/react";

const ProgressBar = ({
  percentage,
  shouldApplyMargin = false,
  width,
  shouldApplyBorderRadius,
  color,
}: {
  percentage: number;
  shouldApplyMargin?: boolean;
  width?: number;
  shouldApplyBorderRadius?: boolean;
  color?: string;
}) => (
  <Progress
    margin={shouldApplyMargin ? "auto" : "inherit"}
    w={width ? `${width}%` : "60%"}
    colorScheme={color ? color : "indigo"}
    height="2.75vh"
    value={percentage}
    borderRadius={shouldApplyBorderRadius ? "md" : 0}
  />
);

export default ProgressBar;
