export async function initTracing() {
  const apiKey = import.meta.env.VITE_HONEYCOMB_API_KEY;
  if (!apiKey) return;

  try {
    const { HoneycombWebSDK } = await import('@honeycombio/opentelemetry-web');
    const { FetchInstrumentation } = await import('@opentelemetry/instrumentation-fetch');

    const sdk = new HoneycombWebSDK({
      apiKey,
      serviceName: 'torchsnuffer-web',
      instrumentations: [new FetchInstrumentation({ propagateTraceHeaderCorsUrls: [/.*/] })],
    });

    sdk.start();
  } catch (err) {
    console.warn('Failed to initialize tracing:', err);
  }
}
