import { mapTimeValues, trimLabelKey } from '../../business/retirement-dates';

describe('Business boolean logic', () => {
  describe('trimLabelKey', () => {
    it('should trim last letter', () => {
      expect(trimLabelKey(1, 'keys')).toBe('key');
      expect(trimLabelKey(0, 'keys')).toBe('key');
      expect(trimLabelKey(-1, 'keys')).toBe('key');
    });
    it('should keep same key', () => {
      expect(trimLabelKey(2, 'keys')).toBe('keys');
      expect(trimLabelKey(10, 'keys')).toBe('keys');
    });
  });

  describe('mapTimeValues', () => {
    it('should filter two biggest non zero values', () => {
      expect(
        mapTimeValues({
          years: 1,
          months: 2,
          weeks: 3,
          days: 4,
        }),
      ).toMatchObject([
        { key: 'years', value: 1 },
        { key: 'months', value: 2 },
      ]);
      expect(
        mapTimeValues({
          years: 0,
          months: 2,
          weeks: 3,
          days: 0,
        }),
      ).toMatchObject([
        { key: 'months', value: 2 },
        { key: 'weeks', value: 3 },
      ]);
    });
  });
});
