// import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import { CirclePicker } from "react-color";
import { VStack } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { Image } from "openai/resources/images.mjs";

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

function Canvas() {
  const [color, setColor] = useState("#ffffff");
  let canvasRef =
    useRef<React.MutableRefObject<HTMLCanvasElement | undefined>>();

  const [images, setImages] = useState<Image[] | undefined>();
  const [dataURL, setDataURL] = useState("");

  const handleChange = (color, event) => {
    console.log("color");
    console.log(color.hex);
    setColor(color.hex);
  };

  const generateImage = api.gpt.generateImage.useMutation({
    retry: false,
    onSuccess: (data: Image[]) => setImages(data),
  });

  return (
    <div
      className="h-screen w-screen flex-col items-center justify-center bg-darkBlue"
      style={{ paddingTop: "10%" }}
    >
      <div>
        <VStack>
          <div>
            <CanvasDraw
              ref={canvasRef}
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
        <button
          onClick={() => {
            console.log(canvasRef.current.getDataURL());
            setDataURL(canvasRef.current.getDataURL());
            generateImage.mutate({ imagePath: canvasRef.current.getDataURL() });
          }}
        >
          GetDataURL
        </button>
      </div>
    </div>
  );
}

export default Canvas;
