import dynamic from "next/dynamic";

const CanvasDraw = dynamic(() => import("./Canvas"), {
  ssr: false,
});

export default CanvasDraw;
