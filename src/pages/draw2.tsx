import React, { useRef } from "react";
import html2canvas from "html2canvas";

const ScreenCapture = () => {
  const captureAreaRef = useRef(null);
  const outputRef = useRef(null);

  const handleCaptureClick = () => {
    if (captureAreaRef.current) {
      html2canvas(captureAreaRef.current).then((canvas) => {
        if (outputRef.current) {
          // Clear previous output
          outputRef.current.innerHTML = "";
          // Append the new canvas
          outputRef.current.appendChild(canvas);
        }
      });
    }
  };

  return (
    <div>
      <div
        ref={captureAreaRef}
        style={{
          padding: "20px",
          border: "1px solid #ddd",
          marginBottom: "20px",
        }}
      >
        {/* Content you want to capture */}
        <h2>Capture This Area</h2>
        <p>This is the area of the webpage that will be captured.</p>
        {/* You can add more content here */}
      </div>
      <button onClick={handleCaptureClick}>Capture</button>
      <div ref={outputRef} style={{ marginTop: "20px" }}>
        {/* The captured image will be displayed here */}
      </div>
    </div>
  );
};

export default ScreenCapture;
