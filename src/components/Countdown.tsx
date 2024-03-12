import { type Dispatch, useEffect, useState } from "react";

const Countdown = ({ setShowCanvas }: { setShowCanvas: Dispatch<any> }) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));

      if (seconds === 0) {
        setShowCanvas(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p className="reg-text text-white">Time to next set: {seconds} seconds</p>
    </div>
  );
};

export default Countdown;
