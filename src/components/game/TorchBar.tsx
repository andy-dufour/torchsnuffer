import { TorchIcon } from './TorchIcon';
import type { GamePhase } from '../../types';

interface TorchBarProps {
  attemptsUsed: number;
  gameStatus: GamePhase;
  animating?: boolean;
}

export function TorchBar({ attemptsUsed, gameStatus, animating }: TorchBarProps) {
  const hasWon = gameStatus === 'won' || gameStatus === 'guessing_season';
  const isLost = gameStatus === 'lost';

  const snuffedCount = hasWon ? Math.max(0, attemptsUsed - 1) : attemptsUsed;
  const showActive = !isLost;

  const torches: { lit: boolean; justSnuffed: boolean; justAppeared: boolean }[] = [];

  for (let i = 0; i < snuffedCount; i++) {
    torches.push({
      lit: false,
      justSnuffed: !!animating && i === snuffedCount - 1,
      justAppeared: false,
    });
  }

  if (showActive) {
    torches.push({
      lit: true,
      justSnuffed: false,
      justAppeared: !!animating && snuffedCount > 0,
    });
  }

  return (
    <div className="flex justify-center gap-1.5 py-2 min-h-[48px]" role="group" aria-label={`${attemptsUsed} of 6 attempts used`}>
      {torches.map((torch, i) => (
        <TorchIcon
          key={i}
          lit={torch.lit}
          justSnuffed={torch.justSnuffed}
          justAppeared={torch.justAppeared}
        />
      ))}
    </div>
  );
}
