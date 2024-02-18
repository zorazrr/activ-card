import ProgressBar from "./ProgressBar";
import { HStack } from "@chakra-ui/react";

interface ProgressMetricProps {
  label: string;
  percentage: number;
}

const ProgressMetric = ({ label, percentage }: ProgressMetricProps) => (
  <HStack w="100%">
    <p className="reg-text w-40">{label}</p>
    <ProgressBar percentage={percentage} />
    <p className="reg-text w-10">{percentage}%</p>
  </HStack>
);

export default ProgressMetric;
