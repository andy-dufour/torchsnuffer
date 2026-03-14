import { useState, useMemo, useCallback } from 'react';
import type { Castaway } from '../types';
import castawaysData from '../data/castaways.json';
import { fuzzyMatchCastaways } from '../lib/fuzzyMatch';

const castaways = castawaysData as Castaway[];

export function useAutocomplete() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    if (query.length < 1) return [];
    return fuzzyMatchCastaways(query, castaways);
  }, [query]);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    setSelectedIndex(-1);
    setIsOpen(value.length >= 1);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, onSelect: (name: string) => void) => {
    if (!isOpen || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        onSelect(selected.name);
        setQuery('');
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [isOpen, results, selectedIndex]);

  const selectItem = useCallback((_name: string) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSelectedIndex(-1);
  }, []);

  return {
    query,
    results,
    selectedIndex,
    isOpen,
    handleInputChange,
    handleKeyDown,
    selectItem,
    close,
  };
}
