import { describe, it, expect } from 'vitest';
import { mulberry32, seededShuffle, hashString } from '../src/lib/prng';

describe('mulberry32 PRNG', () => {
  it('produces deterministic output for same seed', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(42);
    const seq1 = Array.from({ length: 10 }, () => rng1());
    const seq2 = Array.from({ length: 10 }, () => rng2());
    expect(seq1).toEqual(seq2);
  });

  it('produces different output for different seeds', () => {
    const rng1 = mulberry32(42);
    const rng2 = mulberry32(99);
    expect(rng1()).not.toEqual(rng2());
  });

  it('produces values between 0 and 1', () => {
    const rng = mulberry32(12345);
    for (let i = 0; i < 100; i++) {
      const val = rng();
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThan(1);
    }
  });
});

describe('seededShuffle', () => {
  it('is deterministic with same seed', () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result1 = seededShuffle(arr, 42);
    const result2 = seededShuffle(arr, 42);
    expect(result1).toEqual(result2);
  });

  it('does not mutate the original array', () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    seededShuffle(arr, 42);
    expect(arr).toEqual(copy);
  });

  it('contains all original elements', () => {
    const arr = [10, 20, 30, 40, 50];
    const shuffled = seededShuffle(arr, 99);
    expect(shuffled.sort()).toEqual([10, 20, 30, 40, 50]);
  });

  it('produces different order for different seeds', () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const s1 = seededShuffle(arr, 1);
    const s2 = seededShuffle(arr, 2);
    expect(s1).not.toEqual(s2);
  });
});

describe('hashString', () => {
  it('produces consistent hash for same input', () => {
    expect(hashString('hello')).toEqual(hashString('hello'));
  });

  it('produces different hashes for different inputs', () => {
    expect(hashString('2026-04-01')).not.toEqual(hashString('2026-04-02'));
  });

  it('returns non-negative number', () => {
    expect(hashString('test')).toBeGreaterThanOrEqual(0);
  });
});

describe('reveal order determinism', () => {
  it('same date produces same reveal order', () => {
    const words = ['The', 'tribe', 'has', 'spoken'];
    const salt = 'torch-snuffer-reveal-v1';

    const revealSeed1 = hashString('2026-04-01' + salt);
    const revealSeed2 = hashString('2026-04-01' + salt);
    const indices = words.map((_, i) => i);

    expect(seededShuffle(indices, revealSeed1)).toEqual(seededShuffle(indices, revealSeed2));
  });

  it('different dates produce different reveal orders', () => {
    const words = ['The', 'tribe', 'has', 'spoken', 'and', 'you', 'are', 'out'];
    const salt = 'torch-snuffer-reveal-v1';
    const indices = words.map((_, i) => i);

    const order1 = seededShuffle(indices, hashString('2026-04-01' + salt));
    const order2 = seededShuffle(indices, hashString('2026-04-02' + salt));
    expect(order1).not.toEqual(order2);
  });
});
