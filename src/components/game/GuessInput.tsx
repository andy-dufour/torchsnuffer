import { useRef, useEffect } from 'react';
import { useAutocomplete } from '../../hooks/useAutocomplete';

interface GuessInputProps {
  onSubmit: (name: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onSubmit, disabled }: GuessInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { query, results, selectedIndex, isOpen, handleInputChange, handleKeyDown, selectItem, close } = useAutocomplete();

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSelect = (name: string) => {
    selectItem(name);
    onSubmit(name);
  };

  const handleSubmitFromInput = () => {
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleSelect(results[selectedIndex].name);
    } else if (results.length === 1) {
      handleSelect(results[0].name);
    }
  };

  return (
    <div className="relative mx-4">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && selectedIndex < 0) {
              e.preventDefault();
              handleSubmitFromInput();
              return;
            }
            handleKeyDown(e, handleSelect);
          }}
          onBlur={() => setTimeout(close, 200)}
          disabled={disabled}
          placeholder="Guess the castaway..."
          className="flex-1 bg-bg-tertiary text-text-primary placeholder:text-text-muted rounded-lg px-4 py-3 text-base outline-none focus:ring-2 focus:ring-flame transition-all disabled:opacity-40"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Castaway guess"
          aria-expanded={isOpen}
          role="combobox"
          aria-autocomplete="list"
        />
        <button
          onClick={handleSubmitFromInput}
          disabled={disabled || results.length === 0}
          className="bg-flame hover:bg-flame-hot active:bg-ember text-white font-bold px-5 py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Guess
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 bg-bg-secondary border border-bg-tertiary rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto"
          role="listbox"
        >
          {results.map((castaway, i) => (
            <li
              key={castaway.name}
              role="option"
              aria-selected={i === selectedIndex}
              className={`px-4 py-2.5 cursor-pointer transition-colors ${
                i === selectedIndex ? 'bg-bg-tertiary' : 'hover:bg-bg-tertiary/50'
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(castaway.name);
              }}
            >
              <span className="text-text-primary font-medium">{castaway.name}</span>
              <span className="text-text-muted text-sm ml-2">
                {castaway.seasons.map(s => `S${s}`).join(', ')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
