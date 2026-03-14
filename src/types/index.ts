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
  revealSize: number;
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
  seasonHintUsed?: boolean;
  seasonHintValue?: string;
  completedAt?: number;
}

export interface Guess {
  type: "guess" | "reveal" | "hint";
  value: string;
  correct: boolean;
  wordsRevealed: number[];
  autoRevealedWords?: number[];
  timestamp: number;
}

export const ERA_LABELS: Record<string, string> = {
  classic: "Classic Era (Seasons 1–8)",
  middle: "Middle Era (Seasons 9–20)",
  new: "New School (Seasons 21–34)",
  modern: "Modern Era (Seasons 35–47)",
};

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
  1: { title: "Sole Survivor", torches: 0, emoji: "🔥" },
  2: { title: "Immunity Winner", torches: 1, emoji: "💨🔥" },
  3: { title: "Alliance Leader", torches: 2, emoji: "💨💨🔥" },
  4: { title: "Tribal Threat", torches: 3, emoji: "💨💨💨🔥" },
  5: { title: "On the Chopping Block", torches: 4, emoji: "💨💨💨💨🔥" },
  6: { title: "Survived by a Thread", torches: 5, emoji: "💨💨💨💨💨🔥" },
  0: { title: "Torch Snuffed", torches: 6, emoji: "💨💨💨💨💨💨" },
};

export const MAX_ATTEMPTS = 6;
export const GAME_EPOCH = "2026-04-01";
export const PUZZLE_SEED = 0xDEADBEEF;
export const REVEAL_SALT = "torch-snuffer-reveal-v1";
