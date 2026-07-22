import React, { useEffect, useEffectEvent, useState } from "react";

interface IUseCountDownProps {
  initialTimeInSeconds: number;
  expiryCondition?: number;
}

export const useCountDown = ({
  initialTimeInSeconds,
  expiryCondition = 0,
}: IUseCountDownProps) => {
  const [timeInSeconds, setTimeInSeconds] = useState(initialTimeInSeconds);

  const onTick = useEffectEvent(() => {
    setTimeInSeconds((prev) => prev - 1);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  const displayMinutes = String(minutes).padStart(2, "0");
  const displaySeconds = String(seconds).padStart(2, "0");

  return {
    displayTime: `${displayMinutes}:${displaySeconds}`,
    isExpired: timeInSeconds <= expiryCondition,
  };
};
