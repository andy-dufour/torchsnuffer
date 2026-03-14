import type { PlayerStats } from '../../types';
import { MAX_ATTEMPTS } from '../../types';

interface GuessDistributionProps {
  stats: PlayerStats;
  todayAttempts?: number;
}

export function GuessDistribution({ stats, todayAttempts }: GuessDistributionProps) {
  const distribution = stats.distributionByAttempts;
  const maxCount = Math.max(1, ...Object.values(distribution));

  return (
    <div className="mx-4 mt-4">
      <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
        Guess Distribution
      </h3>
      <div className="space-y-1.5">
        {Array.from({ length: MAX_ATTEMPTS }, (_, i) => i + 1).map(attempt => {
          const count = distribution[attempt] ?? 0;
          const width = Math.max(8, (count / maxCount) * 100);
          const isToday = todayAttempts === attempt;

          return (
            <div key={attempt} className="flex items-center gap-2 text-sm">
              <span className="text-text-secondary w-3 text-right">{attempt}</span>
              <div
                className={`h-6 rounded-sm flex items-center justify-end px-2 text-xs font-bold transition-all ${
                  isToday ? 'bg-flame text-white' : 'bg-bg-tertiary text-text-secondary'
                }`}
                style={{ width: `${width}%` }}
              >
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
