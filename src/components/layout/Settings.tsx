import { useState, useEffect } from 'react';
import { setDisplayName as apiSetDisplayName } from '../../lib/api';

const SETTINGS_KEY = 'torch-snuffer-settings';

interface SettingsData {
  hardMode: boolean;
  displayName: string;
  analyticsConsent: boolean;
}

function getSettings(): SettingsData {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : { hardMode: false, displayName: '', analyticsConsent: false };
  } catch {
    return { hardMode: false, displayName: '', analyticsConsent: false };
  }
}

function saveSettings(settings: SettingsData) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function Settings() {
  const [settings, setSettings] = useState<SettingsData>(getSettings);
  const [nameInput, setNameInput] = useState(settings.displayName);
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const handleSaveName = async () => {
    const trimmed = nameInput.trim().slice(0, 20);
    if (!trimmed) return;

    try {
      await apiSetDisplayName(trimmed);
      setSettings(prev => ({ ...prev, displayName: trimmed }));
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 1500);
    } catch {
      // Silently fail - name still saved locally
      setSettings(prev => ({ ...prev, displayName: trimmed }));
    }
  };

  return (
    <div className="py-4 px-4">
      <h2 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
        Settings
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between bg-bg-secondary rounded-lg p-4">
          <div>
            <p className="text-text-primary font-medium">Hard Mode</p>
            <p className="text-text-muted text-xs mt-0.5">No auto-reveal on wrong guesses</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, hardMode: !prev.hardMode }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.hardMode ? 'bg-flame' : 'bg-bg-tertiary'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              settings.hardMode ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="bg-bg-secondary rounded-lg p-4">
          <p className="text-text-primary font-medium mb-2">Display Name</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={20}
              placeholder="Anonymous Castaway"
              className="flex-1 bg-bg-tertiary text-text-primary placeholder:text-text-muted rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-flame"
            />
            <button
              onClick={handleSaveName}
              className="bg-flame hover:bg-flame-hot text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
            >
              {nameSaved ? '✓' : 'Save'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-bg-secondary rounded-lg p-4">
          <div>
            <p className="text-text-primary font-medium">Analytics</p>
            <p className="text-text-muted text-xs mt-0.5">Help improve Torch Snuffer</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, analyticsConsent: !prev.analyticsConsent }))}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.analyticsConsent ? 'bg-flame' : 'bg-bg-tertiary'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
              settings.analyticsConsent ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}
