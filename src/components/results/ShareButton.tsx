import { useState } from 'react';
import type { GameState } from '../../types';
import { copyShareToClipboard, getTwitterShareUrl } from '../../lib/share';

interface ShareButtonProps {
  gameState: GameState;
}

export function ShareButton({ gameState }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyShareToClipboard(gameState);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleTwitter = () => {
    window.open(getTwitterShareUrl(gameState), '_blank', 'noopener');
  };

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={handleCopy}
        className="flex-1 bg-flame hover:bg-flame-hot active:bg-ember text-white font-bold py-3 rounded-lg transition-colors"
      >
        {copied ? '✓ Copied!' : 'Share'}
      </button>
      <button
        onClick={handleTwitter}
        className="bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-primary font-bold px-5 py-3 rounded-lg transition-colors"
        aria-label="Share to X"
      >
        𝕏
      </button>
    </div>
  );
}
