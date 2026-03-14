import type { Guess } from '../../types';

interface GuessHistoryProps {
  guesses: Guess[];
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  if (guesses.length === 0) return null;

  return (
    <div className="mx-4 space-y-1.5 mt-3" aria-label="Guess history" role="log">
      {guesses.map((guess, i) => (
        <div
          key={i}
          className="flex items-center gap-2 text-sm animate-[slide-in-left_200ms_ease-out]"
        >
          {guess.type === 'reveal' ? (
            <>
              <span className="text-text-muted">→</span>
              <span className="text-text-secondary">Revealed a word</span>
            </>
          ) : guess.correct ? (
            <>
              <span className="text-jungle">✓</span>
              <span className="text-jungle font-medium">{guess.value}</span>
            </>
          ) : (
            <>
              <span className="text-ember">✗</span>
              <span className="text-text-secondary">{guess.value}</span>
              {guess.autoRevealedWord !== undefined && (
                <span className="text-text-muted text-xs">(+1 word)</span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
