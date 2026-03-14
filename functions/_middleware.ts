import { instrument } from '@microlabs/otel-cf-workers';
import { otelConfig, type TracedEnv } from './lib/tracing';

const nextFnMap = new WeakMap<Request, () => Promise<Response>>();

const instrumentedWorker = instrument(
  {
    async fetch(request: Request) {
      const next = nextFnMap.get(request);
      if (!next) throw new Error('Missing Pages context');
      return next();
    },
  },
  otelConfig,
);

export const onRequest: PagesFunction<TracedEnv>[] = [
  async (context) => {
    if (!context.env.HONEYCOMB_API_KEY) {
      return context.next();
    }

    nextFnMap.set(context.request, () => context.next());
    try {
      return await instrumentedWorker.fetch(context.request, context.env, {
        waitUntil: (p: Promise<unknown>) => context.waitUntil(p),
        passThroughOnException: () => {},
      });
    } finally {
      nextFnMap.delete(context.request);
    }
  },
];
