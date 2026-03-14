import { useState, useEffect, useCallback } from 'react';
import type { PlayerStats } from '../types';
import { fetchStats } from '../lib/api';

const STATS_CACHE_KEY = 'torch-snuffer-stats';

function getCachedStats(): PlayerStats | null {
  try {
    const raw = localStorage.getItem(STATS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedStats(stats: PlayerStats) {
  localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(stats));
}

export function useStats() {
  const [stats, setStats] = useState<PlayerStats | null>(getCachedStats);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchStats();
      setStats(data);
      setCachedStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { stats, isLoading, error, reload: load };
}
