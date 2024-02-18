import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CirclePicker } from "react-color";
import { VStack } from "@chakra-ui/react";
// Dynamically import the CanvasDraw component, disabling SSR
const CanvasDrawNoSSR = dynamic(() => import("react-canvas-draw"), {
  ssr: false,
});

const colors = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
];

function MyApp() {
  const [color, setColor] = useState("#ffffff");

  const handleChange = (color, event) => {
    console.log("color");
    console.log(color.hex);
    setColor(color.hex);
  };
  return (
    <div
      className="h-screen w-screen flex-col items-center justify-center bg-darkBlue"
      style={{ paddingTop: "10%" }}
    >
      <div>
        <VStack>
          <div>
            <CanvasDrawNoSSR
              brushColor={color}
              hideGrid={true}
              canvasWidth={500}
              canvasHeight={500}
            />
          </div>
          <div>
            <CirclePicker onChange={handleChange} colors={colors} />
          </div>
        </VStack>
      </div>
    </div>
  );
}

export default MyApp;
