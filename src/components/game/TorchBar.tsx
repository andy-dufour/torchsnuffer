import { TorchIcon } from './TorchIcon';
import { MAX_ATTEMPTS } from '../../types';

interface TorchBarProps {
  attemptsUsed: number;
  lastSnuffedIndex?: number;
}

export function TorchBar({ attemptsUsed, lastSnuffedIndex }: TorchBarProps) {
  const torches = Array.from({ length: MAX_ATTEMPTS }, (_, i) => ({
    lit: i >= attemptsUsed,
    justSnuffed: lastSnuffedIndex !== undefined && i === lastSnuffedIndex,
  }));

  return (
    <div className="flex justify-center gap-1 py-2" role="group" aria-label={`${MAX_ATTEMPTS - attemptsUsed} of ${MAX_ATTEMPTS} attempts remaining`}>
      {torches.map((torch, i) => (
        <TorchIcon key={i} lit={torch.lit} justSnuffed={torch.justSnuffed} />
      ))}
    </div>
  );
}
