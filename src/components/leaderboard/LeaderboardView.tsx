import { useEffect } from 'react';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { LeaderboardTable } from './LeaderboardTable';

export function LeaderboardView() {
  const { data, date, setDate, isLoading, error, load } = useLeaderboard();

  useEffect(() => { load(); }, [load]);

  return (
    <div className="py-4">
      <h2 className="text-2xl font-bold text-center mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Leaderboard
      </h2>

      <div className="flex justify-center mb-4">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-bg-tertiary text-text-primary rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-flame"
        />
      </div>

      {isLoading && !data && (
        <div className="text-text-muted text-center py-8">Loading...</div>
      )}

      {error && !data && (
        <div className="text-ember text-center py-8">{error}</div>
      )}

      {data && (
        <>
          <p className="text-text-muted text-xs text-center mb-3">
            {data.totalPlayers} player{data.totalPlayers !== 1 ? 's' : ''} today
          </p>
          <LeaderboardTable
            entries={data.entries}
            playerRank={data.playerRank}
          />
        </>
      )}
    </div>
  );
}
