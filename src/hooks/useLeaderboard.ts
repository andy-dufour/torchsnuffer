import { useState, useCallback } from 'react';
import type { LeaderboardEntry } from '../types';
import { fetchLeaderboard } from '../lib/api';
import { getTodayET } from '../lib/dates';

interface LeaderboardData {
  entries: LeaderboardEntry[];
  playerRank: number;
  totalPlayers: number;
}

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [date, setDate] = useState(getTodayET());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (targetDate?: string) => {
    const d = targetDate ?? date;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchLeaderboard(d);
      setData(result);
      if (targetDate) setDate(targetDate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  return { data, date, setDate: (d: string) => { setDate(d); load(d); }, isLoading, error, load };
}
