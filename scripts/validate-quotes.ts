import quotes from '../src/data/quotes.json';
import castaways from '../src/data/castaways.json';
import seasons from '../src/data/seasons.json';

interface ValidationError {
  quoteId: number;
  field: string;
  message: string;
}

const errors: ValidationError[] = [];
const seenIds = new Set<number>();
const seenQuotes = new Set<string>();
const castawayNames = new Set(castaways.map((c: { name: string }) => c.name.toLowerCase()));
const seasonNumbers = new Set(seasons.map((s: { number: number }) => s.number));

let easyCount = 0;
let mediumCount = 0;
let hardCount = 0;

for (const quote of quotes) {
  const q = quote as {
    id: number; quote: string; speaker: string; season: string;
    seasonNumber: number; seasonDisplay: string; context: string;
    era: string; difficulty: string; tags?: string[];
  };

  if (seenIds.has(q.id)) {
    errors.push({ quoteId: q.id, field: 'id', message: `Duplicate ID: ${q.id}` });
  }
  seenIds.add(q.id);

  if (seenQuotes.has(q.quote.toLowerCase())) {
    errors.push({ quoteId: q.id, field: 'quote', message: 'Duplicate quote text' });
  }
  seenQuotes.add(q.quote.toLowerCase());

  if (!q.quote || !q.quote.trim()) {
    errors.push({ quoteId: q.id, field: 'quote', message: 'Empty quote' });
  }

  const wordCount = q.quote.split(' ').length;
  if (wordCount < 5) {
    errors.push({ quoteId: q.id, field: 'quote', message: `Too short: ${wordCount} words (min 5)` });
  }
  if (wordCount > 20) {
    errors.push({ quoteId: q.id, field: 'quote', message: `Too long: ${wordCount} words (max 20)` });
  }

  if (!q.speaker || !q.speaker.trim()) {
    errors.push({ quoteId: q.id, field: 'speaker', message: 'Empty speaker' });
  } else if (!castawayNames.has(q.speaker.toLowerCase())) {
    errors.push({ quoteId: q.id, field: 'speaker', message: `Speaker not in castaways.json: "${q.speaker}"` });
  }

  if (!seasonNumbers.has(q.seasonNumber)) {
    errors.push({ quoteId: q.id, field: 'seasonNumber', message: `Invalid season number: ${q.seasonNumber}` });
  }

  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) {
    errors.push({ quoteId: q.id, field: 'difficulty', message: `Invalid difficulty: ${q.difficulty}` });
  }

  if (!['classic', 'middle', 'new', 'modern'].includes(q.era)) {
    errors.push({ quoteId: q.id, field: 'era', message: `Invalid era: ${q.era}` });
  }

  if (q.difficulty === 'easy') easyCount++;
  else if (q.difficulty === 'medium') mediumCount++;
  else if (q.difficulty === 'hard') hardCount++;
}

const total = quotes.length;

console.log(`\nQuote Validation Results`);
console.log(`========================`);
console.log(`Total quotes: ${total}`);
console.log(`Easy: ${easyCount} (${Math.round(easyCount / total * 100)}% — target 30%)`);
console.log(`Medium: ${mediumCount} (${Math.round(mediumCount / total * 100)}% — target 50%)`);
console.log(`Hard: ${hardCount} (${Math.round(hardCount / total * 100)}% — target 20%)`);
console.log();

if (errors.length === 0) {
  console.log('✓ All quotes pass validation!');
} else {
  console.log(`✗ ${errors.length} error(s) found:\n`);
  for (const err of errors) {
    console.log(`  Quote #${err.quoteId} [${err.field}]: ${err.message}`);
  }
  process.exit(1);
}
