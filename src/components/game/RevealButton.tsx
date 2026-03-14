interface RevealButtonProps {
  onReveal: () => void;
  disabled?: boolean;
  allRevealed?: boolean;
}

export function RevealButton({ onReveal, disabled, allRevealed }: RevealButtonProps) {
  return (
    <button
      onClick={onReveal}
      disabled={disabled || allRevealed}
      className="mx-4 w-[calc(100%-2rem)] py-2.5 border border-text-muted text-text-secondary rounded-lg hover:border-flame hover:text-flame transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
      aria-label="Reveal a word"
    >
      {allRevealed ? 'All words revealed' : 'Reveal a word'}
    </button>
  );
}
