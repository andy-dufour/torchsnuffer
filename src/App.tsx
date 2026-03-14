import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { CookieConsent } from './components/layout/CookieConsent';
import { GameBoard } from './components/game/GameBoard';
import { StatsView } from './components/stats/StatsView';
import { LeaderboardView } from './components/leaderboard/LeaderboardView';
import { HowToPlay } from './components/tutorial/HowToPlay';
import { Settings } from './components/layout/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg-primary text-text-primary max-w-[480px] mx-auto pb-16">
        <Header />
        <Routes>
          <Route path="/" element={<GameBoard />} />
          <Route path="/stats" element={<StatsView />} />
          <Route path="/leaderboard" element={<LeaderboardView />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<HowToPlay />} />
        </Routes>
        <BottomNav />
        <CookieConsent />
      </div>
    </BrowserRouter>
  );
}

export default App;
