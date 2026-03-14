import type { PlayerStats } from '../../types';

interface SummaryCardsProps {
  stats: PlayerStats;
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-bg-secondary rounded-lg p-3 text-center">
      <div className="text-2xl font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </div>
  );
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const winPct = stats.totalPlayed > 0
    ? Math.round((stats.totalWon / stats.totalPlayed) * 100)
    : 0;

  const seasonPct = stats.totalWon > 0
    ? Math.round((stats.seasonBonuses / stats.totalWon) * 100)
    : 0;

  return (
    <div className="grid grid-cols-3 gap-2 mx-4">
      <Card label="Played" value={stats.totalPlayed} />
      <Card label="Win %" value={`${winPct}%`} />
      <Card label="Streak" value={stats.currentStreak} />
      <Card label="Max Streak" value={stats.maxStreak} />
      <Card label="Season %" value={`${seasonPct}%`} />
      <Card label="Won" value={stats.totalWon} />
    </div>
  );
}
