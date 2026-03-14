import { useState, useMemo, useCallback } from 'react';
import type { Season } from '../types';
import seasonsData from '../data/seasons.json';

const seasons = seasonsData as Season[];

export function useSeasonPicker() {
  const [query, setQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredSeasons = useMemo(() => {
    if (!query.trim()) return seasons;
    const q = query.toLowerCase();
    return seasons.filter(s =>
      s.display.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      String(s.number).includes(q),
    );
  }, [query]);

  const groupedSeasons = useMemo(() => {
    const groups: Record<string, Season[]> = {
      classic: [],
      middle: [],
      'new': [],
      modern: [],
    };
    for (const s of filteredSeasons) {
      groups[s.era]?.push(s);
    }
    return groups;
  }, [filteredSeasons]);

  const eraLabels: Record<string, string> = {
    classic: 'Classic Era (S1–S10)',
    middle: 'Middle Era (S11–S20)',
    'new': 'New Era (S21–S30)',
    modern: 'Modern Era (S31+)',
  };

  const handleSelect = useCallback((season: Season) => {
    setSelectedSeason(season);
    setQuery(season.display);
    setIsOpen(false);
  }, []);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedSeason(null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  return {
    query,
    selectedSeason,
    filteredSeasons,
    groupedSeasons,
    eraLabels,
    isOpen,
    handleSelect,
    handleInputChange,
    close,
    open,
  };
}
