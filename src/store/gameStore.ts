import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameState, DailyPuzzle } from '../types';

interface GameStore {
  puzzle: DailyPuzzle | null;
  gameState: GameState | null;
  answer: { speaker: string; season: string } | null;
  isLoading: boolean;
  error: string | null;
  setPuzzle: (puzzle: DailyPuzzle) => void;
  setGameState: (state: GameState) => void;
  setAnswer: (answer: { speaker: string; season: string } | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      puzzle: null,
      gameState: null,
      answer: null,
      isLoading: false,
      error: null,
      setPuzzle: (puzzle) => set({ puzzle }),
      setGameState: (gameState) => set({ gameState }),
      setAnswer: (answer) => set({ answer }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set({ puzzle: null, gameState: null, answer: null, error: null }),
    }),
    {
      name: 'torch-snuffer-game',
      partialize: (state) => ({
        puzzle: state.puzzle,
        gameState: state.gameState,
        answer: state.answer,
      }),
    },
  ),
);
