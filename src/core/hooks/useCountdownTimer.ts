import { minutesToSeconds } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useCountdownTimer = (minutes: number, enabled: boolean = true) => {
  const initialTime = minutesToSeconds(minutes);
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (enabled && time) {
      intervalRef.current = setInterval(() => setTime(time ? time - 1 : 0), 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [time, enabled]);

  return {
    minutes: Math.floor(time / 60),
    seconds: time % 60,
    totalTimeInSeconds: time,
    reset: useCallback(() => setTime(initialTime), [initialTime]),
    stop: useCallback(() => clearInterval(intervalRef.current), []),
  };
};
