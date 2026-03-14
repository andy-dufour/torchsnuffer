import { HoneycombWebSDK } from '@honeycombio/opentelemetry-web';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

export function initTracing() {
  const apiKey = import.meta.env.VITE_HONEYCOMB_API_KEY;
  if (!apiKey) return;

  const sdk = new HoneycombWebSDK({
    apiKey,
    serviceName: 'torchsnuffer-web',
    instrumentations: [new FetchInstrumentation({ propagateTraceHeaderCorsUrls: [/.*/] })],
  });

  sdk.start();
}
