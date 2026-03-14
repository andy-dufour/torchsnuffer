import { getDailyPuzzle, getQuoteById } from '../../lib/puzzle';
import { getPlayerIdFromCookie } from '../../lib/auth';
import { processGuess, processReveal, processSeasonHint } from '../../lib/validate';
import { tracedKvGet, tracedKvPut, type TracedEnv } from '../../lib/tracing';
import type { GameState } from '../../../src/types';

function getTodayET(): string {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return et.toISOString().split('T')[0];
}

export async function handleGuess(request: Request, env: TracedEnv): Promise<Response> {
  const playerId = getPlayerIdFromCookie(request);
  if (!playerId) {
    return new Response(JSON.stringify({ error: 'No player ID' }), { status: 401 });
  }

  const body = await request.json() as { action: 'guess' | 'reveal' | 'hint'; value?: string };
  const today = getTodayET();
  const puzzle = getDailyPuzzle(today);

  const kvKey = `player:${playerId}:game:${today}`;
  const savedState = await tracedKvGet<GameState>(env.GAME_KV, kvKey);
  if (!savedState) {
    return new Response(JSON.stringify({ error: 'No active game' }), { status: 400 });
  }

  let result: { state: GameState; error?: string };

  if (body.action === 'reveal') {
    result = processReveal(savedState, puzzle);
  } else if (body.action === 'hint') {
    result = processSeasonHint(savedState, puzzle);
  } else if (body.action === 'guess' && body.value) {
    result = processGuess(savedState, puzzle, body.value);
  } else {
    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  }

  if (result.error) {
    return new Response(JSON.stringify({ error: result.error }), { status: 400 });
  }

  await tracedKvPut(env.GAME_KV, kvKey, JSON.stringify(result.state), {
    expirationTtl: 30 * 86400,
  });

  const response: Record<string, unknown> = { state: result.state };

  if (result.state.status === 'lost') {
    const quote = getQuoteById(puzzle.quoteId);
    response.answer = quote
      ? { speaker: quote.speaker, season: quote.seasonDisplay }
      : null;
  }

  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  });
}
