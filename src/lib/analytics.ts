const CONSENT_KEY = 'torch-snuffer-cookie-consent';

function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function initGA4(measurementId: string) {
  if (!hasConsent()) return;
  if (window.gtag) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (!hasConsent() || !window.gtag) return;
  window.gtag('event', name, params);
}

export function trackGameStart(puzzleNumber: number, difficulty: string) {
  trackEvent('game_start', { puzzle_number: puzzleNumber, difficulty });
}

export function trackGuessMade(attemptNumber: number, correct: boolean) {
  trackEvent('guess_made', { attempt_number: attemptNumber, correct });
}

export function trackWordRevealed(attemptNumber: number, wordsVisible: number) {
  trackEvent('word_revealed', { attempt_number: attemptNumber, words_visible: wordsVisible });
}

export function trackGameComplete(result: 'won' | 'lost', attempts: number, seasonCorrect: boolean) {
  trackEvent('game_complete', { result, attempts, season_correct: seasonCorrect });
}

export function trackShareClicked(method: 'clipboard' | 'twitter') {
  trackEvent('share_clicked', { method });
}

export function trackStreakMilestone(streakLength: number) {
  trackEvent('streak_milestone', { streak_length: streakLength });
}

export function trackLeaderboardViewed(date: string) {
  trackEvent('leaderboard_viewed', { date });
}
