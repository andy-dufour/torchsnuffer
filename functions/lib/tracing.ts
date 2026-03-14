import { trace } from '@opentelemetry/api';
import type { ResolveConfigFn } from '@microlabs/otel-cf-workers';

export interface TracedEnv {
  GAME_KV: KVNamespace;
  HONEYCOMB_API_KEY?: string;
}

export const otelConfig: ResolveConfigFn<TracedEnv> = (env) => ({
  exporter: {
    url: 'https://api.honeycomb.io/v1/traces',
    headers: { 'x-honeycomb-team': env.HONEYCOMB_API_KEY || '' },
  },
  service: { name: 'torchsnuffer-api' },
});

const tracer = trace.getTracer('torchsnuffer-api');

export async function tracedKvGet<T>(kv: KVNamespace, key: string): Promise<T | null> {
  return tracer.startActiveSpan('kv.get', async (span) => {
    span.setAttribute('kv.key', key);
    try {
      const result = await kv.get<T>(key, 'json');
      span.setAttribute('kv.hit', result !== null);
      return result;
    } catch (err) {
      span.recordException(err as Error);
      throw err;
    } finally {
      span.end();
    }
  });
}

export async function tracedKvPut(
  kv: KVNamespace,
  key: string,
  value: string,
  options?: KVNamespacePutOptions,
): Promise<void> {
  return tracer.startActiveSpan('kv.put', async (span) => {
    span.setAttribute('kv.key', key);
    try {
      await kv.put(key, value, options);
    } catch (err) {
      span.recordException(err as Error);
      throw err;
    } finally {
      span.end();
    }
  });
}
