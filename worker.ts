import { instrument } from '@microlabs/otel-cf-workers';
import type { ResolveConfigFn } from '@microlabs/otel-cf-workers';
import { handleToday } from './functions/api/game/today';
import { handleGuess } from './functions/api/game/guess';
import { handleSeason } from './functions/api/game/season';

interface Env {
  GAME_KV: KVNamespace;
  HONEYCOMB_API_KEY?: string;
  ASSETS: Fetcher;
}

const otelConfig: ResolveConfigFn<Env> = (env) => ({
  exporter: {
    url: 'https://api.honeycomb.io/v1/traces',
    headers: { 'x-honeycomb-team': env.HONEYCOMB_API_KEY || '' },
  },
  service: { name: 'torchsnuffer-api' },
});

const worker = {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/game/today' && request.method === 'GET') {
        return await handleToday(request, env);
      }
      if (url.pathname === '/api/game/guess' && request.method === 'POST') {
        return await handleGuess(request, env);
      }
      if (url.pathname === '/api/game/season' && request.method === 'POST') {
        return await handleSeason(request, env);
      }
      if (url.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (err) {
      console.error('API error:', err);
      return new Response(JSON.stringify({ error: 'Internal error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};

export default instrument(worker, otelConfig);
