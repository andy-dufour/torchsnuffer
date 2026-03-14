import type { DailyPuzzle, Quote } from '../../src/types';
import quotesData from '../../src/data/quotes.json';

const quotes = quotesData as Quote[];

const EPOCH = new Date("2026-04-01T00:00:00-04:00");
const PUZZLE_SEED = 0xDEADBEEF;
const REVEAL_SALT = "torch-snuffer-reveal-v1";

export function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 86400000;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

export function getRevealSize(wordCount: number): number {
  return Math.max(1, Math.floor(wordCount / 6));
}

export function getDailyPuzzle(date: string): DailyPuzzle {
  const dayIndex = daysBetween(EPOCH, new Date(date + "T00:00:00-04:00"));
  const shuffledQuotes = seededShuffle(quotes, PUZZLE_SEED);
  const quote = shuffledQuotes[((dayIndex % shuffledQuotes.length) + shuffledQuotes.length) % shuffledQuotes.length];

  const words = quote.quote.split(' ');
  const revealSize = getRevealSize(words.length);

  const protectedCount = Math.min(2, Math.max(0, words.length - 1));
  const protectedIndices = new Set(
    Array.from({ length: protectedCount }, (_, i) => words.length - 1 - i),
  );
  const revealableIndices = words.map((_, i) => i).filter(i => !protectedIndices.has(i));

  const revealSeed = hashString(date + REVEAL_SALT);
  const revealOrder = seededShuffle(revealableIndices, revealSeed);

  return {
    puzzleNumber: dayIndex + 1,
    date,
    quoteId: quote.id,
    quote: quote.quote,
    wordCount: words.length,
    revealOrder,
    revealSize,
    context: quote.context,
    difficulty: quote.difficulty,
  };
}

export function getQuoteById(id: number): Quote | undefined {
  return quotes.find(q => q.id === id);
}
