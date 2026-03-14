import { trace } from '@opentelemetry/api';

export interface TracedEnv {
  GAME_KV: KVNamespace;
  HONEYCOMB_API_KEY?: string;
}

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
