import { useState, useRef, useCallback } from 'react';

export function useTimer() {
  const [time, setTime] = useState('00:00');
  const secondsRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      secondsRef.current += 1;
      const next = secondsRef.current;
      const mins = Math.floor(next / 60).toString().padStart(2, '0');
      const secs = (next % 60).toString().padStart(2, '0');
      setTime(`${mins}:${secs}`);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    secondsRef.current = 0;
    setTime('00:00');
  }, [stop]);

  return { time, start, stop, reset };
}
