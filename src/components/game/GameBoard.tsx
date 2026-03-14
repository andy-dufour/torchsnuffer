import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../hooks/useGame';
import { TorchBar } from './TorchBar';
import { QuoteDisplay } from './QuoteDisplay';
import { GuessInput } from './GuessInput';
import { RevealButton } from './RevealButton';
import { GuessHistory } from './GuessHistory';
import { SeasonPicker } from './SeasonPicker';
import { ResultModal } from '../results/ResultModal';

export function GameBoard() {
  const navigate = useNavigate();
  const {
    puzzle,
    gameState,
    answer,
    isLoading,
    error,
    attemptsUsed,
    isGameOver,
    isGuessingsSeason,
    loadGame,
    submitGuess,
    revealWord,
    submitSeason,
  } = useGame();

  const [torchAnimating, setTorchAnimating] = useState(false);
  const [newlyRevealed, setNewlyRevealed] = useState<number[]>([]);
  const [autoRevealed, setAutoRevealed] = useState<number[]>([]);
  const [showCorrectGlow, setShowCorrectGlow] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadGame();
  }, [loadGame]);

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => setShowResult(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isGameOver]);

  useEffect(() => {
    if (!gameState?.guesses.length) return;
    const lastGuess = gameState.guesses[gameState.guesses.length - 1];

    if (lastGuess.wordsRevealed.length > 0) setNewlyRevealed(lastGuess.wordsRevealed);
    if (lastGuess.autoRevealedWords?.length) setAutoRevealed(lastGuess.autoRevealedWords);

    const isSnuff = (lastGuess.type === 'guess' && !lastGuess.correct) || lastGuess.type === 'reveal';
    if (isSnuff) setTorchAnimating(true);
    if (lastGuess.type === 'guess' && lastGuess.correct) {
      setShowCorrectGlow(true);
      setTimeout(() => setShowCorrectGlow(false), 600);
    }

    const timer = setTimeout(() => {
      setNewlyRevealed([]);
      setAutoRevealed([]);
      setTorchAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [gameState?.guesses.length]);

  if (!puzzle || !gameState) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-text-muted">Loading puzzle...</div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-ember">{error}</div>
        </div>
      );
    }
    return null;
  }

  const words = puzzle.quote.split(' ');
  const displayRevealedIndices = isGameOver
    ? words.map((_, i) => i)
    : gameState.revealedWordIndices;
  const allRevealed = gameState.revealedWordIndices.length >= words.length;
  const correctSpeaker = gameState.guesses.find(g => g.correct)?.value ?? '';

  return (
    <div className="flex flex-col gap-3 py-4">
      <TorchBar attemptsUsed={attemptsUsed} gameStatus={gameState.status} animating={torchAnimating} />

      <QuoteDisplay
        words={words}
        revealedIndices={displayRevealedIndices}
        context={puzzle.context}
        newlyRevealed={newlyRevealed}
        autoRevealed={autoRevealed}
        isCorrect={showCorrectGlow}
      />

      {!isGameOver && !isGuessingsSeason && (
        <>
          <GuessInput onSubmit={submitGuess} disabled={isLoading} />
          <RevealButton onReveal={revealWord} disabled={isLoading} allRevealed={allRevealed} />
        </>
      )}

      {isGuessingsSeason && (
        <SeasonPicker
          onSubmit={submitSeason}
          disabled={isLoading}
          correctSpeaker={correctSpeaker}
        />
      )}

      <GuessHistory guesses={gameState.guesses} />

      {showResult && isGameOver && (
        <ResultModal
          gameState={gameState}
          answer={answer}
          quote={puzzle.quote}
          onClose={() => setShowResult(false)}
          onViewLeaderboard={() => { setShowResult(false); navigate('/leaderboard'); }}
        />
      )}
    </div>
  );
}
