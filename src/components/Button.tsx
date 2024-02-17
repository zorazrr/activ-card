import React from "react";
import { Button, color } from "@chakra-ui/react";
interface ButtonProps {
  colorInd: number;
  label: string;
  onClick: () => void;
  style?: React.CSSProperties; // Optional style prop
}

const colors: string[] = [
  "reg-text w-32 rounded-md bg-darkBlue  py-2 text-white hover:bg-midBlue",
  "reg-text w-32 rounded-md bg-mediumBlue  py-2 text-white hover:bg-midBlue",
  "reg-text w-32 rounded-md bg-midBlue py-2 text-white hover:bg-mediumBlue",
];

const StyledButton = ({ label, onClick, colorInd, style }: ButtonProps) => (
  <div className="py-2 ">
    <button onClick={onClick} className={colors[colorInd]} style={style}>
      {label}
    </button>
  </div>
);

export default StyledButton;
