import type { Castaway } from '../types';

interface MatchResult {
  castaway: Castaway;
  score: number;
}

function normalizeString(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function fuzzyMatchCastaways(query: string, castaways: Castaway[], limit = 6): Castaway[] {
  if (!query.trim()) return [];

  const q = normalizeString(query);
  const results: MatchResult[] = [];

  for (const castaway of castaways) {
    const name = normalizeString(castaway.name);
    const fullName = normalizeString(castaway.fullName);
    const aliases = (castaway.aliases ?? []).map(normalizeString);

    let score = Infinity;

    if (name.startsWith(q)) {
      score = Math.min(score, 1);
    } else if (fullName.startsWith(q)) {
      score = Math.min(score, 2);
    }

    if (score === Infinity) {
      for (const alias of aliases) {
        if (alias.startsWith(q)) {
          score = Math.min(score, 3);
          break;
        }
      }
    }

    if (score === Infinity) {
      if (name.includes(q) || fullName.includes(q)) {
        score = 4;
      } else {
        for (const alias of aliases) {
          if (alias.includes(q)) {
            score = 5;
            break;
          }
        }
      }
    }

    if (score < Infinity) {
      results.push({ castaway, score });
    }
  }

  results.sort((a, b) => {
    if (a.score !== b.score) return a.score - b.score;
    return a.castaway.name.localeCompare(b.castaway.name);
  });

  return results.slice(0, limit).map(r => r.castaway);
}
