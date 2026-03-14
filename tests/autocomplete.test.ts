import { describe, it, expect } from 'vitest';
import { fuzzyMatchCastaways } from '../src/lib/fuzzyMatch';
import type { Castaway } from '../src/types';

const testCastaways: Castaway[] = [
  { name: 'Parvati Shallow', fullName: 'Parvati Shallow', seasons: [13, 16, 20, 40], aliases: ['Parv'] },
  { name: 'Sandra Diaz-Twine', fullName: 'Sandra Diaz-Twine', seasons: [7, 20, 34, 40], aliases: ['Sandra', 'Queen'] },
  { name: 'Rob Mariano', fullName: 'Rob Mariano', seasons: [4, 8, 20, 22, 40], aliases: ['Boston Rob', 'Robfather'] },
  { name: 'Russell Hantz', fullName: 'Russell Hantz', seasons: [19, 20, 22] },
  { name: 'Tony Vlachos', fullName: 'Tony Vlachos', seasons: [28, 34, 40], aliases: ['Tony'] },
  { name: 'Coach Wade', fullName: 'Benjamin Wade', seasons: [18, 20, 23], aliases: ['Coach', 'Dragon Slayer'] },
];

describe('fuzzyMatchCastaways', () => {
  it('returns empty for empty query', () => {
    expect(fuzzyMatchCastaways('', testCastaways)).toEqual([]);
  });

  it('matches name prefix first', () => {
    const results = fuzzyMatchCastaways('Parv', testCastaways);
    expect(results[0].name).toBe('Parvati Shallow');
  });

  it('matches alias prefix', () => {
    const results = fuzzyMatchCastaways('Boston', testCastaways);
    expect(results[0].name).toBe('Rob Mariano');
  });

  it('matches contains anywhere', () => {
    const results = fuzzyMatchCastaways('shallow', testCastaways);
    expect(results.some(r => r.name === 'Parvati Shallow')).toBe(true);
  });

  it('limits results to specified count', () => {
    const results = fuzzyMatchCastaways('a', testCastaways, 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('matches fullName', () => {
    const results = fuzzyMatchCastaways('Benjamin', testCastaways);
    expect(results[0].name).toBe('Coach Wade');
  });

  it('returns nothing for no match', () => {
    expect(fuzzyMatchCastaways('zzzzz', testCastaways)).toEqual([]);
  });
});
