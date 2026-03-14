import { useCountdown } from '../../hooks/useCountdown';

export function CountdownTimer() {
  const { timeLeft } = useCountdown();

  return (
    <div className="text-center">
      <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Next torch in</p>
      <p className="text-text-primary text-2xl font-bold font-mono tracking-widest">{timeLeft}</p>
    </div>
  );
}
