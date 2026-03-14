interface StreakDay {
  date: string;
  status: 'win' | 'loss' | 'unplayed';
  seasonBonus?: boolean;
}

interface StreakCalendarProps {
  days: StreakDay[];
}

export function StreakCalendar({ days }: StreakCalendarProps) {
  const last30 = days.slice(-30);

  return (
    <div className="mx-4 mt-4">
      <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
        Last 30 Days
      </h3>
      <div className="grid grid-cols-10 gap-1">
        {last30.map((day) => (
          <div
            key={day.date}
            className={`w-full aspect-square rounded-sm ${
              day.status === 'win'
                ? 'bg-jungle'
                : day.status === 'loss'
                ? 'bg-ember'
                : 'bg-bg-tertiary'
            } ${day.seasonBonus ? 'ring-1 ring-gold' : ''}`}
            title={`${day.date}: ${day.status}${day.seasonBonus ? ' + season bonus' : ''}`}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-2 text-xs text-text-muted">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-jungle" /> Win
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-ember" /> Loss
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-bg-tertiary" /> —
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm bg-jungle ring-1 ring-gold" /> ⭐
        </div>
      </div>
    </div>
  );
}
