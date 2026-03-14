import { getDailyPuzzle } from '../../lib/puzzle';
import { getPlayerIdFromCookie, generatePlayerId, makePlayerIdCookie } from '../../lib/auth';
import { createFreshGameState } from '../../lib/validate';
import { tracedKvGet, tracedKvPut, type TracedEnv } from '../../lib/tracing';

function getTodayET(): string {
  const now = new Date();
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return et.toISOString().split('T')[0];
}

export async function handleToday(request: Request, env: TracedEnv): Promise<Response> {
  const today = getTodayET();
  const puzzle = getDailyPuzzle(today);

  let playerId = getPlayerIdFromCookie(request);
  let isNewPlayer = false;

  if (!playerId) {
    playerId = generatePlayerId();
    isNewPlayer = true;
  }

  const kvKey = `player:${playerId}:game:${today}`;
  const savedState = await tracedKvGet(env.GAME_KV, kvKey);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isNewPlayer) {
    headers['Set-Cookie'] = makePlayerIdCookie(playerId);
  }

  if (savedState) {
    return new Response(
      JSON.stringify({ puzzle: { ...puzzle, quote: puzzle.quote }, state: savedState }),
      { headers },
    );
  }

  const freshState = createFreshGameState(puzzle);

  await tracedKvPut(env.GAME_KV, kvKey, JSON.stringify(freshState), {
    expirationTtl: 30 * 86400,
  });

  return new Response(
    JSON.stringify({ puzzle, state: freshState }),
    { headers },
  );
}
