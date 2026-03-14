import type { GameState, Guess, DailyPuzzle } from '../../src/types';
import { MAX_ATTEMPTS } from '../../src/types';
import castawaysData from '../../src/data/castaways.json';
import { getQuoteById } from './puzzle';

const castawayNames = new Set(
  (castawaysData as { name: string }[]).map(c => c.name.toLowerCase()),
);

export function isValidCastawayName(name: string): boolean {
  return castawayNames.has(name.toLowerCase());
}

export function isValidSeasonNumber(seasonNumber: number): boolean {
  return Number.isInteger(seasonNumber) && seasonNumber >= 1 && seasonNumber <= 47;
}

function getNextUnrevealedIndices(
  revealOrder: number[],
  revealedIndices: number[],
  count: number,
): number[] {
  const revealed = new Set(revealedIndices);
  const result: number[] = [];
  for (const idx of revealOrder) {
    if (!revealed.has(idx)) {
      result.push(idx);
      if (result.length >= count) break;
    }
  }
  return result;
}

export function processGuess(
  state: GameState,
  puzzle: DailyPuzzle,
  guessValue: string,
): { state: GameState; error?: string } {
  if (state.status !== 'playing') {
    return { state, error: 'Game is not in playing state' };
  }

  if (state.guesses.length >= MAX_ATTEMPTS) {
    return { state, error: 'Maximum attempts reached' };
  }

  if (!isValidCastawayName(guessValue)) {
    return { state, error: 'Invalid castaway name' };
  }

  const quote = getQuoteById(puzzle.quoteId);
  if (!quote) {
    return { state, error: 'Puzzle data error' };
  }

  const isCorrect = guessValue.toLowerCase() === quote.speaker.toLowerCase();

  if (isCorrect) {
    const guess: Guess = {
      type: 'guess',
      value: guessValue,
      correct: true,
      wordsRevealed: [],
      timestamp: Date.now(),
    };

    return {
      state: {
        ...state,
        status: 'guessing_season',
        guesses: [...state.guesses, guess],
      },
    };
  }

  const revealSize = puzzle.revealSize ?? 1;
  const mainWords = getNextUnrevealedIndices(
    puzzle.revealOrder,
    state.revealedWordIndices,
    revealSize,
  );

  const afterMain = [...state.revealedWordIndices, ...mainWords];
  const autoWords = getNextUnrevealedIndices(
    puzzle.revealOrder,
    afterMain,
    revealSize,
  );

  const newRevealed = [...afterMain, ...autoWords];

  const guess: Guess = {
    type: 'guess',
    value: guessValue,
    correct: false,
    wordsRevealed: mainWords,
    autoRevealedWords: autoWords.length > 0 ? autoWords : undefined,
    timestamp: Date.now(),
  };

  const newGuesses = [...state.guesses, guess];
  const isLost = newGuesses.length >= MAX_ATTEMPTS;

  return {
    state: {
      ...state,
      status: isLost ? 'lost' : 'playing',
      revealedWordIndices: newRevealed,
      guesses: newGuesses,
      completedAt: isLost ? Date.now() : undefined,
    },
  };
}

export function processReveal(
  state: GameState,
  puzzle: DailyPuzzle,
): { state: GameState; error?: string } {
  if (state.status !== 'playing') {
    return { state, error: 'Game is not in playing state' };
  }

  if (state.guesses.length >= MAX_ATTEMPTS) {
    return { state, error: 'Maximum attempts reached' };
  }

  const revealSize = puzzle.revealSize ?? 1;
  const nextWords = getNextUnrevealedIndices(
    puzzle.revealOrder,
    state.revealedWordIndices,
    revealSize,
  );

  const newRevealed = nextWords.length > 0
    ? [...state.revealedWordIndices, ...nextWords]
    : [...state.revealedWordIndices];

  const guess: Guess = {
    type: 'reveal',
    value: 'reveal',
    correct: false,
    wordsRevealed: nextWords,
    timestamp: Date.now(),
  };

  const newGuesses = [...state.guesses, guess];
  const isLost = newGuesses.length >= MAX_ATTEMPTS;

  return {
    state: {
      ...state,
      status: isLost ? 'lost' : 'playing',
      revealedWordIndices: newRevealed,
      guesses: newGuesses,
      completedAt: isLost ? Date.now() : undefined,
    },
  };
}

export function processSeasonGuess(
  state: GameState,
  puzzle: DailyPuzzle,
  seasonNumber: number,
): { state: GameState; error?: string } {
  if (state.status !== 'guessing_season') {
    return { state, error: 'Not in season guessing phase' };
  }

  if (!isValidSeasonNumber(seasonNumber)) {
    return { state, error: 'Invalid season number' };
  }

  const quote = getQuoteById(puzzle.quoteId);
  if (!quote) {
    return { state, error: 'Puzzle data error' };
  }

  const isCorrect = seasonNumber === quote.seasonNumber;

  return {
    state: {
      ...state,
      status: 'won',
      seasonGuess: { seasonNumber, correct: isCorrect },
      completedAt: Date.now(),
    },
  };
}

export function createFreshGameState(puzzle: DailyPuzzle): GameState {
  const firstReveal = puzzle.revealOrder[0];
  return {
    date: puzzle.date,
    puzzleNumber: puzzle.puzzleNumber,
    status: 'playing',
    revealedWordIndices: firstReveal !== undefined ? [firstReveal] : [],
    guesses: [],
  };
}
