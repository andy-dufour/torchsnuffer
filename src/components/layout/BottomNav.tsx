import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Play', icon: '🔥' },
  { to: '/stats', label: 'Stats', icon: '📊' },
  { to: '/leaderboard', label: 'Board', icon: '🏆' },
  { to: '/how-to-play', label: 'How to', icon: '❓' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-bg-tertiary z-40">
      <div className="max-w-[480px] mx-auto flex">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                isActive ? 'text-flame' : 'text-text-muted hover:text-text-secondary'
              }`
            }
          >
            <span className="text-lg leading-none mb-0.5">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
