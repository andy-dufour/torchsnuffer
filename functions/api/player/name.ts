import { getPlayerIdFromCookie } from '../../lib/auth';

interface Env {
  GAME_KV: KVNamespace;
}

const PROFANITY_LIST = ['fuck', 'shit', 'ass', 'bitch', 'damn', 'dick', 'cock', 'cunt', 'nigger', 'faggot'];

function containsProfanity(name: string): boolean {
  const lower = name.toLowerCase();
  return PROFANITY_LIST.some(word => lower.includes(word));
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const playerId = getPlayerIdFromCookie(request);
  if (!playerId) {
    return new Response(JSON.stringify({ error: 'No player ID' }), { status: 401 });
  }

  const body = await request.json() as { displayName: string };
  const name = (body.displayName ?? '').trim().slice(0, 20);

  if (!name) {
    return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
  }

  if (containsProfanity(name)) {
    return new Response(JSON.stringify({ error: 'Name contains inappropriate language' }), { status: 400 });
  }

  const settingsKey = `player:${playerId}:settings`;
  const existing = (await env.GAME_KV.get(settingsKey, 'json')) as Record<string, unknown> | null ?? {};
  const updated = { ...existing, displayName: name };

  await env.GAME_KV.put(settingsKey, JSON.stringify(updated));

  return new Response(JSON.stringify({ displayName: name }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
