import { useEffect, useState } from "react";

const Countdown = () => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => (prevSeconds > 0 ? prevSeconds - 1 : 0));
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
