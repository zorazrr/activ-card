// import dynamic from "next/dynamic";
import React, { useState, useRef } from "react";
import CanvasDraw from "react-canvas-draw";
import { CirclePicker } from "react-color";
import { VStack, useDisclosure } from "@chakra-ui/react";
import { type Image } from "openai/resources/images.mjs";
import { api } from "~/utils/api";
import StyledButton from "./Button";
import StyledModal from "./StyledModal";
import ImageModal from "./ImageModal";
import Countdown from "./Countdown";

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
  "#ffffff",
  "#795548",
  "#607d8b",
];

function Canvas({ setCurIndex }: { setCurIndex: Dispatch<any> }) {
  const [color, setColor] = useState("#ffffff");
  const canvasRef =
    useRef<React.MutableRefObject<HTMLCanvasElement | undefined>>();

  const [images, setImages] = useState<Image[] | undefined>();
  const [dataURL, setDataURL] = useState("");

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
          <Countdown />
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
        onClose={() => setCurIndex(4)}
        isOpen={isOpen}
        images={images}
      />
    </div>
  );
}

export default Canvas;
