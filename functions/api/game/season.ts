import { getDailyPuzzle, getQuoteById } from '../../lib/puzzle';
import { getPlayerIdFromCookie } from '../../lib/auth';
import { processSeasonGuess } from '../../lib/validate';
import { tracedKvGet, tracedKvPut, type TracedEnv } from '../../lib/tracing';
import type { GameState } from '../../../src/types';

function getTodayET(): string {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return et.toISOString().split('T')[0];
}

export async function handleSeason(request: Request, env: TracedEnv): Promise<Response> {
  const playerId = getPlayerIdFromCookie(request);
  if (!playerId) {
    return new Response(JSON.stringify({ error: 'No player ID' }), { status: 401 });
  }

  const body = await request.json() as { seasonNumber: number };
  const today = getTodayET();
  const puzzle = getDailyPuzzle(today);

  const kvKey = `player:${playerId}:game:${today}`;
  const savedState = await tracedKvGet<GameState>(env.GAME_KV, kvKey);
  if (!savedState) {
    return new Response(JSON.stringify({ error: 'No active game' }), { status: 400 });
  }

  const result = processSeasonGuess(savedState, puzzle, body.seasonNumber);
  if (result.error) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 });
  }

  await tracedKvPut(env.GAME_KV, kvKey, JSON.stringify(result.state), {
    expirationTtl: 30 * 86400,
  });

  const quote = getQuoteById(puzzle.quoteId);

  const statsKey = `player:${playerId}:stats`;
  const stats = (await tracedKvGet(env.GAME_KV, statsKey)) as Record<string, unknown> | null ?? {
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
  if (result.state.seasonGuess?.correct && !result.state.seasonHintUsed) typedStats.seasonBonuses++;

  const attemptCount = result.state.guesses.length;
  typedStats.distributionByAttempts[attemptCount] =
    (typedStats.distributionByAttempts[attemptCount] ?? 0) + 1;
  typedStats.lastPlayedDate = today;

  await tracedKvPut(env.GAME_KV, statsKey, JSON.stringify(typedStats));

  return new Response(
    JSON.stringify({
      state: result.state,
      answer: quote ? { speaker: quote.speaker, season: quote.seasonDisplay } : null,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
}
