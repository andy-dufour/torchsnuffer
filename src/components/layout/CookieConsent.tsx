import { useState, useEffect } from 'react';

const CONSENT_KEY = 'torch-snuffer-cookie-consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-50 p-4">
      <div className="max-w-[480px] mx-auto bg-bg-secondary border border-bg-tertiary rounded-xl p-4 shadow-xl">
        <p className="text-text-secondary text-xs mb-3">
          We use cookies for anonymous analytics to improve your experience. No personal data is collected.
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 bg-flame hover:bg-flame-hot text-white text-xs font-bold py-2 rounded-lg transition-colors"
          >
            Accept
          </button>
          <button
            onClick={decline}
            className="flex-1 bg-bg-tertiary hover:bg-bg-tertiary/80 text-text-secondary text-xs font-bold py-2 rounded-lg transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
