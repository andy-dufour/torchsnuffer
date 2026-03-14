import { getPlayerIdFromCookie } from '../../lib/auth';

interface Env {
  GAME_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const playerId = getPlayerIdFromCookie(request);
  if (!playerId) {
    return new Response(JSON.stringify({ error: 'No player ID' }), { status: 401 });
  }

  const statsKey = `player:${playerId}:stats`;
  const stats = await env.GAME_KV.get(statsKey, 'json');

  if (!stats) {
    return new Response(
      JSON.stringify({
        playerId,
        totalPlayed: 0,
        totalWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        seasonBonuses: 0,
        distributionByAttempts: {},
        lastPlayedDate: '',
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify(stats), {
    headers: { 'Content-Type': 'application/json' },
  });
};
