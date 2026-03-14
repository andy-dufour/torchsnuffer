interface QuoteDisplayProps {
  words: string[];
  revealedIndices: number[];
  context: string;
  newlyRevealed?: number;
  autoRevealed?: number;
  isCorrect?: boolean;
}

export function QuoteDisplay({
  words,
  revealedIndices,
  context,
  newlyRevealed,
  autoRevealed,
  isCorrect,
}: QuoteDisplayProps) {
  const revealedSet = new Set(revealedIndices);

  return (
    <div className={`rounded-xl bg-bg-secondary p-5 mx-4 transition-shadow duration-600 ${isCorrect ? 'shadow-[0_0_20px_6px_rgba(45,139,94,0.4)]' : ''}`}>
      <div className="flex flex-wrap gap-x-2 gap-y-2 justify-center min-h-[60px] items-center">
        <span className="text-text-secondary text-2xl font-light mr-1">&ldquo;</span>
        {words.map((word, i) => {
          const isRevealed = revealedSet.has(i);
          const isNew = i === newlyRevealed;
          const isAuto = i === autoRevealed;

          if (isRevealed) {
            let animClass = '';
            if (isNew) animClass = 'animate-[word-reveal_300ms_ease-out]';
            if (isAuto) animClass = 'animate-[word-reveal-auto_400ms_ease-out]';

            return (
              <span
                key={i}
                className={`text-text-primary text-lg font-medium ${animClass}`}
              >
                {word}
              </span>
            );
          }

          return (
            <span
              key={i}
              className="inline-block bg-bg-tertiary rounded h-7 align-middle"
              style={{ width: `${Math.max(word.length, 2)}ch` }}
              aria-label="hidden word"
            />
          );
        })}
        <span className="text-text-secondary text-2xl font-light ml-1">&rdquo;</span>
      </div>
      <p className="text-text-secondary text-sm italic text-center mt-3">{context}</p>
    </div>
  );
}
