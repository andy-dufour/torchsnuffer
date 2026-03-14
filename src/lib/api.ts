import type { GameState, DailyPuzzle, PlayerStats, LeaderboardEntry } from '../types';

interface GameResponse {
  puzzle: DailyPuzzle;
  state: GameState;
}

interface GuessResponse {
  state: GameState;
  answer?: { speaker: string; season: string };
  error?: string;
}

interface SeasonResponse {
  state: GameState;
  answer?: { speaker: string; season: string };
  error?: string;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  playerRank: number;
  totalPlayers: number;
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function fetchTodayGame(): Promise<GameResponse> {
  return fetchJson<GameResponse>('/api/game/today');
}

export async function submitGuess(value: string): Promise<GuessResponse> {
  return fetchJson<GuessResponse>('/api/game/guess', {
    method: 'POST',
    body: JSON.stringify({ action: 'guess', value }),
  });
}

export async function submitReveal(): Promise<GuessResponse> {
  return fetchJson<GuessResponse>('/api/game/guess', {
    method: 'POST',
    body: JSON.stringify({ action: 'reveal' }),
  });
}

export async function submitSeasonHint(): Promise<GuessResponse> {
  return fetchJson<GuessResponse>('/api/game/guess', {
    method: 'POST',
    body: JSON.stringify({ action: 'hint' }),
  });
}

export async function submitSeasonGuess(seasonNumber: number): Promise<SeasonResponse> {
  return fetchJson<SeasonResponse>('/api/game/season', {
    method: 'POST',
    body: JSON.stringify({ seasonNumber }),
  });
}

export async function fetchStats(): Promise<PlayerStats> {
  return fetchJson<PlayerStats>('/api/player/stats');
}

export async function setDisplayName(displayName: string): Promise<{ displayName: string }> {
  return fetchJson<{ displayName: string }>('/api/player/name', {
    method: 'POST',
    body: JSON.stringify({ displayName }),
  });
}

export async function fetchLeaderboard(date: string): Promise<LeaderboardResponse> {
  return fetchJson<LeaderboardResponse>(`/api/leaderboard/${date}`);
}
