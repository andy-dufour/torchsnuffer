import { trace } from '@opentelemetry/api';
import type { GameState, DailyPuzzle, PlayerStats, LeaderboardEntry } from '../types';

const tracer = trace.getTracer('torchsnuffer-web');

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
  return tracer.startActiveSpan('game.load', async (span) => {
    try {
      return await fetchJson<GameResponse>('/api/game/today');
    } finally {
      span.end();
    }
  });
}

export async function submitGuess(value: string): Promise<GuessResponse> {
  return tracer.startActiveSpan('game.guess', async (span) => {
    span.setAttribute('guess.value', value);
    try {
      return await fetchJson<GuessResponse>('/api/game/guess', {
        method: 'POST',
        body: JSON.stringify({ action: 'guess', value }),
      });
    } finally {
      span.end();
    }
  });
}

export async function submitReveal(): Promise<GuessResponse> {
  return tracer.startActiveSpan('game.reveal', async (span) => {
    try {
      return await fetchJson<GuessResponse>('/api/game/guess', {
        method: 'POST',
        body: JSON.stringify({ action: 'reveal' }),
      });
    } finally {
      span.end();
    }
  });
}

export async function submitSeasonGuess(seasonNumber: number): Promise<SeasonResponse> {
  return tracer.startActiveSpan('game.seasonGuess', async (span) => {
    span.setAttribute('season.number', seasonNumber);
    try {
      return await fetchJson<SeasonResponse>('/api/game/season', {
        method: 'POST',
        body: JSON.stringify({ seasonNumber }),
      });
    } finally {
      span.end();
    }
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
