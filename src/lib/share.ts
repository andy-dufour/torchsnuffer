import type { GameState } from '../types';

export function buildShareText(state: GameState): string {
  const puzzleNum = state.puzzleNumber;
  const won = state.status === 'won';
  const attemptCount = state.guesses.length;
  const seasonCorrect = state.seasonGuess?.correct ?? false;

  const emojiRow = state.guesses
    .map((g) => {
      if (g.type === 'reveal') return '⬜';
      if (g.correct) return '🔥';
      return '💨';
    })
    .join('');

  const seasonStar = seasonCorrect ? ' — ⭐' : '';
  const snuffed = attemptCount - 1;
  const scoreText = won
    ? `Torches: ${snuffed} snuffed${seasonCorrect ? ' + Season bonus!' : ''}`
    : 'Torch Snuffed 💀';

  return [
    `🔥 TORCH SNUFFER #${puzzleNum}`,
    '',
    `${emojiRow}${seasonStar}`,
    scoreText,
    '',
    'Play at torchsnuffer.com',
  ].join('\n');
}

export async function copyShareToClipboard(state: GameState): Promise<boolean> {
  const text = buildShareText(state);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function getTwitterShareUrl(state: GameState): string {
  const text = buildShareText(state);
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}
