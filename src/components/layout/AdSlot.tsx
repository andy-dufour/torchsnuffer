interface AdSlotProps {
  slot: 'ad-results-rect' | 'ad-stats-banner' | 'ad-leaderboard-banner';
}

const slotSizes: Record<string, { width: number; height: number }> = {
  'ad-results-rect': { width: 300, height: 250 },
  'ad-stats-banner': { width: 320, height: 50 },
  'ad-leaderboard-banner': { width: 320, height: 50 },
};

export function AdSlot({ slot }: AdSlotProps) {
  const enabled = false; // Feature flag: ENABLE_ADS
  if (!enabled) return null;

  const size = slotSizes[slot];
  return (
    <div
      className={slot}
      style={{
        minWidth: size.width,
        minHeight: size.height,
        maxWidth: '100%',
      }}
    />
  );
}
