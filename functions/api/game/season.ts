import { getDailyPuzzle, getQuoteById } from '../../lib/puzzle';
import { getPlayerIdFromCookie } from '../../lib/auth';
import { processSeasonGuess } from '../../lib/validate';
import type { GameState } from '../../../src/types';

interface Env {
  GAME_KV: KVNamespace;
}

function getTodayET(): string {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return et.toISOString().split('T')[0];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const playerId = getPlayerIdFromCookie(request);
  if (!playerId) {
    return new Response(JSON.stringify({ error: 'No player ID' }), { status: 401 });
  }

  const body = await request.json() as { seasonNumber: number };
  const today = getTodayET();
  const puzzle = getDailyPuzzle(today);

  const kvKey = `player:${playerId}:game:${today}`;
  const savedState = await env.GAME_KV.get<GameState>(kvKey, 'json');
  if (!savedState) {
    return new Response(JSON.stringify({ error: 'No active game' }), { status: 400 });
  }

  const result = processSeasonGuess(savedState, puzzle, body.seasonNumber);
  if (result.error) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 });
  }

  await env.GAME_KV.put(kvKey, JSON.stringify(result.state), {
    expirationTtl: 30 * 86400,
  });

  const quote = getQuoteById(puzzle.quoteId);

  // Update player stats
  const statsKey = `player:${playerId}:stats`;
  const stats = (await env.GAME_KV.get(statsKey, 'json')) as Record<string, unknown> | null ?? {
    playerId,
    totalPlayed: 0,
    totalWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    seasonBonuses: 0,
    distributionByAttempts: {},
    lastPlayedDate: '',
  };

  const typedStats = stats as {
    totalPlayed: number;
    totalWon: number;
    currentStreak: number;
    maxStreak: number;
    seasonBonuses: number;
    distributionByAttempts: Record<string, number>;
    lastPlayedDate: string;
  };

  typedStats.totalPlayed++;
  typedStats.totalWon++;
  typedStats.currentStreak++;
  typedStats.maxStreak = Math.max(typedStats.maxStreak, typedStats.currentStreak);
  if (result.state.seasonGuess?.correct) typedStats.seasonBonuses++;

  const attemptCount = result.state.guesses.length;
  typedStats.distributionByAttempts[attemptCount] =
    (typedStats.distributionByAttempts[attemptCount] ?? 0) + 1;
  typedStats.lastPlayedDate = today;

  await env.GAME_KV.put(statsKey, JSON.stringify(typedStats));

  return new Response(
    JSON.stringify({
      state: result.state,
      answer: quote ? { speaker: quote.speaker, season: quote.seasonDisplay } : null,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
};
