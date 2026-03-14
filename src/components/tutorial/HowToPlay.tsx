const steps = [
  { icon: '💬', text: 'A famous Survivor quote is hidden — words appear one at a time in random positions.' },
  { icon: '🤔', text: 'Guess the castaway who said it, or reveal a word for a clue.' },
  { icon: '💨', text: 'Wrong guesses cost an attempt BUT reveal a bonus word as a consolation.' },
  { icon: '6️⃣', text: 'You have 6 total attempts (guesses + reveals combined).' },
  { icon: '⭐', text: 'Guess the castaway correctly, then try the bonus season guess for a star!' },
  { icon: '📤', text: 'Share your emoji score and compete on the daily leaderboard!' },
];

export function HowToPlay() {
  return (
    <div className="py-4 px-4">
      <h2 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        How to Play
      </h2>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="text-2xl leading-none flex-shrink-0 w-8 text-center">{step.icon}</span>
            <p className="text-text-secondary text-sm leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-bg-secondary rounded-lg p-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">
          Scoring
        </h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-text-secondary">Guess 1</span><span>🔥🔥🔥🔥🔥🔥 Sole Survivor</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Guess 2</span><span>🔥🔥🔥🔥🔥 Immunity Winner</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Guess 3</span><span>🔥🔥🔥🔥 Alliance Leader</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Guess 4</span><span>🔥🔥🔥 Tribal Threat</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Guess 5</span><span>🔥🔥 On the Chopping Block</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Guess 6</span><span>🔥 Survived by a Thread</span></div>
          <div className="flex justify-between"><span className="text-text-secondary">Failed</span><span>💀 Torch Snuffed</span></div>
        </div>
      </div>
    </div>
  );
}
