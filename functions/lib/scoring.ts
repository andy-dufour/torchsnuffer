import type { GameState, LeaderboardEntry, ScoreRating } from '../../src/types';
import { SCORE_RATINGS } from '../../src/types';

export function getScoreRating(state: GameState): ScoreRating {
  if (state.status === 'lost') {
    return SCORE_RATINGS[0];
  }

  const attemptCount = state.guesses.filter(g => g.type === 'guess').length;
  return SCORE_RATINGS[attemptCount] ?? SCORE_RATINGS[0];
}

export function getAttemptCount(state: GameState): number {
  return state.guesses.length;
}

export function compareLeaderboardEntries(
  a: LeaderboardEntry,
  b: LeaderboardEntry,
): number {
  if (a.attempts !== b.attempts) return a.attempts - b.attempts;
  if (a.seasonCorrect !== b.seasonCorrect) return b.seasonCorrect ? 1 : -1;
  return a.completedAt - b.completedAt;
}
