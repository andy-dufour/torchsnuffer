import type { LeaderboardEntry } from '../../types';
import { RankBadge } from './RankBadge';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  playerRank: number;
  currentPlayerId?: string;
}

function formatTime(ms: number): string {
  const date = new Date(ms);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function LeaderboardTable({ entries, playerRank, currentPlayerId }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="text-text-muted text-center py-8 text-sm">
        No scores yet today. Be the first!
      </div>
    );
  }

  return (
    <div className="mx-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bg-tertiary text-text-muted text-xs uppercase tracking-wider">
            <th className="py-2 text-left w-10">#</th>
            <th className="py-2 text-left">Name</th>
            <th className="py-2 text-center w-16">Tries</th>
            <th className="py-2 text-center w-10">⭐</th>
            <th className="py-2 text-right w-16">Time</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const isCurrentPlayer = entry.playerId === currentPlayerId;
            return (
              <tr
                key={entry.playerId}
                className={`border-b border-bg-tertiary/50 ${
                  isCurrentPlayer ? 'bg-flame/10' : ''
                }`}
              >
                <td className="py-2.5">
                  <RankBadge rank={i + 1} />
                </td>
                <td className={`py-2.5 ${isCurrentPlayer ? 'text-flame font-medium' : 'text-text-primary'}`}>
                  {entry.displayName}
                </td>
                <td className="py-2.5 text-center text-text-secondary">{entry.attempts}/6</td>
                <td className="py-2.5 text-center">{entry.seasonCorrect ? '⭐' : '—'}</td>
                <td className="py-2.5 text-right text-text-muted text-xs">{formatTime(entry.completedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {playerRank > 0 && playerRank > 100 && (
        <p className="text-text-muted text-xs text-center mt-3">
          Your rank: #{playerRank}
        </p>
      )}
    </div>
  );
}
