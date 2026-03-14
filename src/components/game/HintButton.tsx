import { useState } from 'react';

interface HintButtonProps {
  onHint: () => void;
  disabled?: boolean;
  alreadyUsed?: boolean;
}

export function HintButton({ onHint, disabled, alreadyUsed }: HintButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (alreadyUsed) return null;

  if (confirming) {
    return (
      <div className="mx-4 flex gap-2">
        <button
          onClick={() => { setConfirming(false); onHint(); }}
          disabled={disabled}
          className="flex-1 py-2.5 bg-gold/20 border border-gold text-gold rounded-lg hover:bg-gold/30 transition-colors disabled:opacity-30 text-sm font-medium"
        >
          Yes, use hint
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="flex-1 py-2.5 border border-text-muted text-text-secondary rounded-lg hover:border-text-secondary transition-colors text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      disabled={disabled}
      className="mx-4 w-[calc(100%-2rem)] py-2.5 border border-gold/40 text-gold/70 rounded-lg hover:border-gold hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
      aria-label="Get a season era hint"
    >
      🔮 Season hint (costs a torch, no bonus)
    </button>
  );
}
