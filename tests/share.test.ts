import { describe, it, expect } from 'vitest';
import { buildShareText } from '../src/lib/share';
import type { GameState } from '../src/types';

describe('buildShareText', () => {
  it('builds correct share text for a win', () => {
    const state: GameState = {
      date: '2026-04-01',
      puzzleNumber: 42,
      status: 'won',
      revealedWordIndices: [0, 1, 2],
      guesses: [
        { type: 'reveal', value: 'reveal', correct: false, wordRevealed: 1, timestamp: 1 },
        { type: 'guess', value: 'Wrong', correct: false, wordRevealed: 2, autoRevealedWord: 3, timestamp: 2 },
        { type: 'guess', value: 'Correct', correct: true, wordRevealed: -1, timestamp: 3 },
      ],
      seasonGuess: { seasonNumber: 7, correct: true },
      completedAt: Date.now(),
    };

    const text = buildShareText(state);
    expect(text).toContain('TORCH SNUFFER #42');
    expect(text).toContain('⬜💨🔥');
    expect(text).toContain('⭐');
    expect(text).toContain('3/6');
    expect(text).toContain('Season bonus!');
    expect(text).toContain('torchsnuffer.com');
  });

  it('builds correct share text for a loss', () => {
    const state: GameState = {
      date: '2026-04-01',
      puzzleNumber: 10,
      status: 'lost',
      revealedWordIndices: [],
      guesses: Array(6).fill({
        type: 'guess' as const,
        value: 'Wrong',
        correct: false,
        wordRevealed: 0,
        autoRevealedWord: 1,
        timestamp: 1,
      }),
      completedAt: Date.now(),
    };

    const text = buildShareText(state);
    expect(text).toContain('💨💨💨💨💨💨');
    expect(text).toContain('Torch Snuffed 💀');
    expect(text).not.toContain('⭐');
  });

  it('shows no season star when season guess is wrong', () => {
    const state: GameState = {
      date: '2026-04-01',
      puzzleNumber: 5,
      status: 'won',
      revealedWordIndices: [0],
      guesses: [
        { type: 'guess', value: 'Correct', correct: true, wordRevealed: -1, timestamp: 1 },
      ],
      seasonGuess: { seasonNumber: 20, correct: false },
      completedAt: Date.now(),
    };

    const text = buildShareText(state);
    expect(text).not.toContain('⭐');
    expect(text).toContain('1/6');
  });
});
