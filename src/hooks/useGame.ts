import { useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import * as api from '../lib/api';

export function useGame() {
  const {
    puzzle, gameState, answer, isLoading, error,
    setPuzzle, setGameState, setAnswer, setLoading, setError,
  } = useGameStore();

  const loadGame = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTodayGame();
      setPuzzle(data.puzzle);
      setGameState(data.state);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  }, [setPuzzle, setGameState, setLoading, setError]);

  const submitGuess = useCallback(async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.submitGuess(value);
      setGameState(data.state);
      if (data.answer) setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit guess');
    } finally {
      setLoading(false);
    }
  }, [setGameState, setAnswer, setLoading, setError]);

  const revealWord = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.submitReveal();
      setGameState(data.state);
      if (data.answer) setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reveal word');
    } finally {
      setLoading(false);
    }
  }, [setGameState, setAnswer, setLoading, setError]);

  const submitSeason = useCallback(async (seasonNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.submitSeasonGuess(seasonNumber);
      setGameState(data.state);
      if (data.answer) setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit season guess');
    } finally {
      setLoading(false);
    }
  }, [setGameState, setAnswer, setLoading, setError]);

  const attemptsUsed = gameState?.guesses.length ?? 0;
  const attemptsRemaining = 6 - attemptsUsed;
  const isGameOver = gameState?.status === 'won' || gameState?.status === 'lost';
  const isGuessingsSeason = gameState?.status === 'guessing_season';

  return {
    puzzle,
    gameState,
    answer,
    isLoading,
    error,
    attemptsUsed,
    attemptsRemaining,
    isGameOver,
    isGuessingsSeason,
    loadGame,
    submitGuess,
    revealWord,
    submitSeason,
  };
}
