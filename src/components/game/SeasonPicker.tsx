import { useRef, useEffect } from 'react';
import { useSeasonPicker } from '../../hooks/useSeasonPicker';

interface SeasonPickerProps {
  onSubmit: (seasonNumber: number) => void;
  disabled?: boolean;
  correctSpeaker: string;
}

export function SeasonPicker({ onSubmit, disabled, correctSpeaker }: SeasonPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query, selectedSeason, groupedSeasons, eraLabels, isOpen,
    handleSelect, handleInputChange, close, open,
  } = useSeasonPicker();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (selectedSeason) {
      onSubmit(selectedSeason.number);
    }
  };

  return (
    <div className="mx-4 animate-[slide-up_300ms_ease-out]">
      <div className="bg-jungle/20 border border-jungle rounded-lg p-4 mb-4 text-center">
        <span className="text-jungle font-bold text-lg">
          ✓ Correct! It was {correctSpeaker}.
        </span>
      </div>

      <p className="text-text-secondary text-center mb-3 font-medium">
        Bonus: Which season?
      </p>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={open}
          onBlur={() => setTimeout(close, 200)}
          disabled={disabled}
          placeholder="Search seasons..."
          className="w-full bg-bg-tertiary text-text-primary placeholder:text-text-muted rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-gold transition-all"
          role="combobox"
          aria-label="Season picker"
          aria-expanded={isOpen}
        />

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-bg-secondary border border-bg-tertiary rounded-lg shadow-xl max-h-64 overflow-y-auto">
            {Object.entries(groupedSeasons).map(([era, seasons]) => {
              if (seasons.length === 0) return null;
              return (
                <div key={era}>
                  <div className="px-3 py-1.5 text-xs font-bold text-text-muted uppercase tracking-wider bg-bg-primary/50 sticky top-0">
                    {eraLabels[era]}
                  </div>
                  {seasons.map((season) => (
                    <button
                      key={season.number}
                      type="button"
                      className="w-full text-left px-4 py-2 hover:bg-bg-tertiary/50 transition-colors text-text-primary text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(season);
                      }}
                    >
                      {season.display}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={disabled || !selectedSeason}
        className="w-full mt-3 bg-gold hover:bg-gold/90 active:bg-gold/80 text-bg-primary font-bold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Lock it in
      </button>
    </div>
  );
}
