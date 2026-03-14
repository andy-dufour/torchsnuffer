import { describe, it, expect } from 'vitest';
import type { GameState, DailyPuzzle } from '../src/types';
import { createFreshGameState, processGuess, processReveal, processSeasonGuess } from '../functions/lib/validate';

function makePuzzle(overrides?: Partial<DailyPuzzle>): DailyPuzzle {
  return {
    puzzleNumber: 1,
    date: '2026-04-01',
    quoteId: 1,
    quote: 'I can get loud too! What the hell?',
    wordCount: 8,
    revealOrder: [3, 1, 5, 0, 4, 2],
    revealSize: 1,
    context: 'Camp confrontation',
    difficulty: 'easy',
    ...overrides,
  };
}

describe('createFreshGameState', () => {
  it('starts with first reveal order word visible', () => {
    const puzzle = makePuzzle();
    const state = createFreshGameState(puzzle);
    expect(state.status).toBe('playing');
    expect(state.revealedWordIndices).toEqual([3]);
    expect(state.guesses).toEqual([]);
  });
});

describe('processReveal', () => {
  it('reveals next word in order and costs an attempt', () => {
    const puzzle = makePuzzle();
    const state = createFreshGameState(puzzle);

    const { state: next } = processReveal(state, puzzle);
    expect(next.revealedWordIndices).toContain(1);
    expect(next.guesses).toHaveLength(1);
    expect(next.guesses[0].type).toBe('reveal');
  });

  it('rejects reveal when game is over', () => {
    const puzzle = makePuzzle();
    const state: GameState = {
      ...createFreshGameState(puzzle),
      status: 'won',
    };
    const { error } = processReveal(state, puzzle);
    expect(error).toBeDefined();
  });
});

describe('processGuess', () => {
  it('transitions to guessing_season on correct guess', () => {
    const puzzle = makePuzzle();
    const state = createFreshGameState(puzzle);

    const { state: next } = processGuess(state, puzzle, 'Sandra Diaz-Twine');
    expect(next.status).toBe('guessing_season');
    expect(next.guesses).toHaveLength(1);
    expect(next.guesses[0].correct).toBe(true);
  });

  it('reveals two words on wrong guess', () => {
    const puzzle = makePuzzle();
    const state = createFreshGameState(puzzle);

    const { state: next } = processGuess(state, puzzle, 'Russell Hantz');
    expect(next.status).toBe('playing');
    expect(next.guesses[0].correct).toBe(false);
    expect(next.guesses[0].autoRevealedWords).toBeDefined();
    expect(next.revealedWordIndices.length).toBeGreaterThan(state.revealedWordIndices.length);
  });

  it('rejects invalid castaway name', () => {
    const puzzle = makePuzzle();
    const state = createFreshGameState(puzzle);

    const { error } = processGuess(state, puzzle, 'Not A Real Person');
    expect(error).toBe('Invalid castaway name');
  });

  it('results in loss after 6 wrong guesses', () => {
    const puzzle = makePuzzle();
    let state = createFreshGameState(puzzle);

    const wrongNames = ['Russell Hantz', 'Parvati Shallow', 'Rob Mariano', 'Tony Vlachos', 'Ozzy Lusth', 'Cirie Fields'];
    for (const name of wrongNames) {
      const result = processGuess(state, puzzle, name);
      state = result.state;
    }
    expect(state.status).toBe('lost');
    expect(state.guesses).toHaveLength(6);
  });
});

describe('processSeasonGuess', () => {
  it('sets won status with correct season', () => {
    const puzzle = makePuzzle();
    const state: GameState = {
      ...createFreshGameState(puzzle),
      status: 'guessing_season',
      guesses: [{ type: 'guess', value: 'Sandra Diaz-Twine', correct: true, wordsRevealed: [], timestamp: Date.now() }],
    };

    const { state: next } = processSeasonGuess(state, puzzle, 7);
    expect(next.status).toBe('won');
    expect(next.seasonGuess?.correct).toBe(true);
  });

  it('still wins with wrong season but marks incorrect', () => {
    const puzzle = makePuzzle();
    const state: GameState = {
      ...createFreshGameState(puzzle),
      status: 'guessing_season',
      guesses: [{ type: 'guess', value: 'Sandra Diaz-Twine', correct: true, wordsRevealed: [], timestamp: Date.now() }],
    };

    const { state: next } = processSeasonGuess(state, puzzle, 20);
    expect(next.status).toBe('won');
    expect(next.seasonGuess?.correct).toBe(false);
  });

  it('rejects season guess when not in guessing_season phase', () => {
    const puzzle = makePuzzle();
    const state = createFreshGameState(puzzle);

    const { error } = processSeasonGuess(state, puzzle, 7);
    expect(error).toBe('Not in season guessing phase');
  });
});
