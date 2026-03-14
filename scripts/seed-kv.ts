/**
 * Generates puzzle data for the next N days and outputs KV-compatible JSON.
 * Usage: npx tsx scripts/seed-kv.ts [days]
 *
 * In production, run via `wrangler kv:bulk put` or a scheduled worker.
 */

import { getDailyPuzzle } from '../functions/lib/puzzle';

const days = parseInt(process.argv[2] ?? '7', 10);
const entries: { key: string; value: string; expiration_ttl: number }[] = [];

const today = new Date();
today.setHours(0, 0, 0, 0);

for (let i = 0; i < days; i++) {
  const date = new Date(today.getTime() + i * 86400000);
  const dateStr = date.toISOString().split('T')[0];
  const puzzle = getDailyPuzzle(dateStr);

  entries.push({
    key: `puzzle:${dateStr}`,
    value: JSON.stringify(puzzle),
    expiration_ttl: 48 * 3600,
  });
}

console.log(JSON.stringify(entries, null, 2));
console.log(`\nGenerated ${entries.length} puzzle entries for the next ${days} days.`);
console.log('Use: wrangler kv:bulk put --namespace-id=<id> < output.json');
