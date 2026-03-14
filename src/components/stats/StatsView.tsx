import { useStats } from '../../hooks/useStats';
import { SummaryCards } from './SummaryCards';
import { GuessDistribution } from './GuessDistribution';

export function StatsView() {
  const { stats, isLoading, error } = useStats();

  if (isLoading && !stats) {
    return <div className="text-text-muted text-center py-12">Loading stats...</div>;
  }

  if (error && !stats) {
    return <div className="text-ember text-center py-12">{error}</div>;
  }

  if (!stats) return null;

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-center mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Statistics
      </h2>
      <SummaryCards stats={stats} />
      <GuessDistribution stats={stats} />
    </div>
  );
}
