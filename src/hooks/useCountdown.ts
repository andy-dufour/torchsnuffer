import { useState, useEffect } from 'react';
import { getNextMidnightET, formatCountdown } from '../lib/dates';

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState('');
  const [msLeft, setMsLeft] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = getNextMidnightET();
      const ms = Math.max(0, target.getTime() - Date.now());
      setMsLeft(ms);
      setTimeLeft(formatCountdown(ms));
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return { timeLeft, msLeft };
}
