import { type Dispatch, useEffect, useState } from "react";

const Countdown = ({
  setShowCanvas,
  didSubmit,
  pomodoroTime,
}: {
  setShowCanvas: Dispatch<any>;
  didSubmit: boolean;
  pomodoroTime: number;
}) => {
  const [seconds, setSeconds] = useState(pomodoroTime);

  useEffect(() => {
    const interval = setInterval(() => {
      if (didSubmit) {
        clearInterval(interval);
        return;
      }

      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          setShowCanvas(false);
        }

        return prevSeconds > 0 ? prevSeconds - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [didSubmit]);

  return (
    <div>
      <p className="reg-text text-white">Time to next set: {seconds} seconds</p>
    </div>
  );
};

export default Countdown;
