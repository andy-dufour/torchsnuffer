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
              <span className="text-text-secondary">Revealed {guess.wordsRevealed.length === 1 ? 'a word' : `${guess.wordsRevealed.length} words`}</span>
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
              {guess.autoRevealedWords && guess.autoRevealedWords.length > 0 && (
                <span className="text-text-muted text-xs">(+{guess.autoRevealedWords.length} {guess.autoRevealedWords.length === 1 ? 'word' : 'words'})</span>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
