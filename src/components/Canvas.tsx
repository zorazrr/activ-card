// import dynamic from "next/dynamic";
import React, { useState, useRef, type Dispatch } from "react";
import CanvasDraw from "react-canvas-draw";
import { CirclePicker } from "react-color";
import { VStack, useDisclosure } from "@chakra-ui/react";
import { type Image } from "openai/resources/images.mjs";
import { api } from "~/utils/api";
import StyledButton from "./Button";
import ImageModal from "./ImageModal";
import Countdown from "./Countdown";

const colors = [
  "#ff1100",
  // "#f44336", // Red
  "#e57373", // Light Red
  "#ff9800", // Orange
  "#ffc107", // Amber
  "#ffeb3b", // Yellow
  "#4caf50", // Green
  "#8bc34a", // Light Green
  // "#cddc39", // Lime (Yellowish Green)
  "#00bcd4", // Cyan
  "#2196f3", // Blue
  "#f263ed",
  "#e91e63", // Pink
  "#9c27b0", // Purple
  "#673ab7", // Deep Purple
  "#3f51b5", // Indigo
  "#000000", // Black
  "#ffffff", // White
  "#607d8b", // Blue Grey
  "#795548", // Brown
];

function Canvas({
  setShowCanvas,
  setId,
}: {
  setShowCanvas: Dispatch<any>;
  setId: string;
}) {
  const [color, setColor] = useState("#ffffff");
  const canvasRef =
    useRef<React.MutableRefObject<HTMLCanvasElement | undefined>>();

  const [images, setImages] = useState<Image[] | undefined>();
  const [dataURL, setDataURL] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);

  const { onClose, onOpen, isOpen } = useDisclosure();

  const handleChange = (color, event) => {
    setColor(color.hex);
  };

  const generateImage = api.gpt.generateImage.useMutation({
    retry: false,
    onSuccess: (data: Image[]) => setImages(data),
  });

  return (
    <div
      className="h-screen w-screen flex-col items-center justify-center bg-darkBlue"
      style={{ paddingTop: "3%" }}
    >
      <div>
        <VStack>
          <div className="h4" style={{ color: "white", fontWeight: 500 }}>
            A break to re-center &#10024;
          </div>
          <Countdown setShowCanvas={setShowCanvas} didSubmit={didSubmit} />
          <div>
            <CanvasDraw
              ref={canvasRef}
              brushColor={color}
              hideGrid={true}
              canvasWidth={500}
              canvasHeight={500}
              brushRadius={6}
              lazyRadius={0}
            />
          </div>
          <br></br>
          <div>
            <CirclePicker onChange={handleChange} colors={colors} />
          </div>
          <br></br>
          <StyledButton
            onClick={() => {
              setDidSubmit(true);
              if (canvasRef.current) {
                const dataURL = canvasRef.current.getDataURL();
                setDataURL(dataURL);
                generateImage.mutate({
                  imagePath: dataURL,
                });
              }
              onOpen();
            }}
            label={"Generate an Image"}
            colorInd={1}
            style={{
              width: "250px",
              paddingLeft: "5%",
              paddingRight: "5%",
            }}
          />
        </VStack>
      </div>
      <ImageModal
        onClose={() => setShowCanvas(false)}
        isOpen={isOpen}
        images={images}
        setId={setId}
      />
    </div>
  );
}

export default Canvas;
