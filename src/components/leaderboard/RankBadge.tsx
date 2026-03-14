interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) return <span className="text-gold font-bold">🥇</span>;
  if (rank === 2) return <span className="text-text-secondary font-bold">🥈</span>;
  if (rank === 3) return <span className="text-ember font-bold">🥉</span>;
  return <span className="text-text-muted font-bold">{rank}</span>;
}
