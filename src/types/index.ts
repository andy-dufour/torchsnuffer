export interface Quote {
  id: number;
  quote: string;
  speaker: string;
  season: string;
  seasonNumber: number;
  seasonDisplay: string;
  episode?: number;
  context: string;
  era: "classic" | "middle" | "new" | "modern";
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
}

export interface Season {
  number: number;
  name: string;
  display: string;
  year: number;
  era: "classic" | "middle" | "new" | "modern";
}

export interface Castaway {
  name: string;
  fullName: string;
  seasons: number[];
  aliases?: string[];
}

export interface DailyPuzzle {
  puzzleNumber: number;
  date: string;
  quoteId: number;
  quote: string;
  wordCount: number;
  revealOrder: number[];
  context: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface GameState {
  date: string;
  puzzleNumber: number;
  status: "playing" | "guessing_season" | "won" | "lost";
  revealedWordIndices: number[];
  guesses: Guess[];
  seasonGuess?: SeasonGuess;
  completedAt?: number;
}

export interface Guess {
  type: "guess" | "reveal";
  value: string;
  correct: boolean;
  wordRevealed: number;
  autoRevealedWord?: number;
  timestamp: number;
}

export interface SeasonGuess {
  seasonNumber: number;
  correct: boolean;
}

export interface PlayerStats {
  playerId: string;
  totalPlayed: number;
  totalWon: number;
  currentStreak: number;
  maxStreak: number;
  seasonBonuses: number;
  distributionByAttempts: Record<number, number>;
  lastPlayedDate: string;
}

export interface LeaderboardEntry {
  playerId: string;
  displayName: string;
  attempts: number;
  seasonCorrect: boolean;
  completedAt: number;
}

export type GamePhase = "playing" | "guessing_season" | "won" | "lost";

export interface ScoreRating {
  title: string;
  torches: number;
  emoji: string;
}

export const SCORE_RATINGS: Record<number, ScoreRating> = {
  1: { title: "Sole Survivor", torches: 6, emoji: "🔥🔥🔥🔥🔥🔥" },
  2: { title: "Immunity Winner", torches: 5, emoji: "🔥🔥🔥🔥🔥" },
  3: { title: "Alliance Leader", torches: 4, emoji: "🔥🔥🔥🔥" },
  4: { title: "Tribal Threat", torches: 3, emoji: "🔥🔥🔥" },
  5: { title: "On the Chopping Block", torches: 2, emoji: "🔥🔥" },
  6: { title: "Survived by a Thread", torches: 1, emoji: "🔥" },
  0: { title: "Torch Snuffed", torches: 0, emoji: "💀" },
};

export const MAX_ATTEMPTS = 6;
export const GAME_EPOCH = "2026-04-01";
export const PUZZLE_SEED = 0xDEADBEEF;
export const REVEAL_SALT = "torch-snuffer-reveal-v1";
