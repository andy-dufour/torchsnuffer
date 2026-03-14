import type { GameState } from '../../types';
import { SCORE_RATINGS } from '../../types';
import { ShareButton } from './ShareButton';
import { CountdownTimer } from './CountdownTimer';

interface ResultModalProps {
  gameState: GameState;
  answer: { speaker: string; season: string } | null;
  quote: string;
  onClose: () => void;
  onViewLeaderboard: () => void;
}

export function ResultModal({ gameState, answer, quote, onClose, onViewLeaderboard }: ResultModalProps) {
  const won = gameState.status === 'won';
  const attempts = gameState.guesses.length;
  const rating = won ? SCORE_RATINGS[attempts] : SCORE_RATINGS[0];
  const seasonCorrect = gameState.seasonGuess?.correct ?? false;

  if (!rating) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-bg-secondary rounded-t-2xl sm:rounded-2xl w-full max-w-[480px] p-6 animate-[slide-up_300ms_ease-out] max-h-[90vh] overflow-y-auto">
        {won ? (
          <>
            <h2 className="text-3xl font-bold text-center mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {rating.title}!
            </h2>
            <p className="text-center text-2xl mb-4">{rating.emoji}</p>

            {seasonCorrect ? (
              <div className="text-center mb-3">
                <span className="text-gold text-lg font-bold animate-[star-burst_500ms_ease-out]">⭐ Perfect read!</span>
              </div>
            ) : answer ? (
              <p className="text-center text-text-secondary text-sm mb-3">
                Season: ✗ (It was {answer.season})
              </p>
            ) : null}

            <p className="text-center text-text-primary text-lg font-medium mb-1">
              Score: {attempts}/6{seasonCorrect ? ' ⭐' : ''}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center mb-2 text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              Your torch has been snuffed.
            </h2>
            <p className="text-center text-2xl mb-4">💀</p>
          </>
        )}

        {answer && (
          <div className="bg-bg-primary rounded-lg p-4 mb-4">
            <p className="text-text-primary italic text-center mb-2">&ldquo;{quote}&rdquo;</p>
            <p className="text-text-secondary text-center text-sm">
              — {answer.speaker}, {answer.season}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <ShareButton gameState={gameState} />

          <CountdownTimer />

          <button
            onClick={onViewLeaderboard}
            className="w-full text-text-secondary hover:text-flame text-sm underline transition-colors"
          >
            View leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
