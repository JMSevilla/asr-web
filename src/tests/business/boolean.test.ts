import { isFalse, isTrue, isYes } from '../../business/boolean';

describe('Business boolean logic', () => {
  describe('isTrue', () => {
    it('should return true for true', () => {
      expect(isTrue(true)).toBe(true);
    });
    it('should return true for "true"', () => {
      expect(isTrue('true')).toBe(true);
    });
    it('should return false for false', () => {
      expect(isTrue(false)).toBe(false);
    });
    it('should return false for "false"', () => {
      expect(isTrue('false')).toBe(false);
    });
    it('should return false for undefined', () => {
      expect(isTrue(undefined)).toBe(false);
    });
    it('should return false for null', () => {
      expect(isTrue(null)).toBe(false);
    });
  });

  describe('isFalse', () => {
    it('should return true for false', () => {
      expect(isFalse(false)).toBe(true);
    });
    it('should return true for "false"', () => {
      expect(isFalse('false')).toBe(true);
    });
    it('should return false for true', () => {
      expect(isFalse(true)).toBe(false);
    });
    it('should return false for "true"', () => {
      expect(isFalse('true')).toBe(false);
    });
    it('should return false for undefined', () => {
      expect(isFalse(undefined)).toBe(false);
    });
    it('should return false for null', () => {
      expect(isFalse(null)).toBe(false);
    });
  });

  describe('isYes', () => {
    it('should return true', () => {
      expect(isYes('test_yes')).toBe(true);
      expect(isYes('test_yes_test')).toBe(true);
      expect(isYes('yes')).toBe(true);
    });

    it('should return false', () => {
      expect(isYes('test_y_es')).toBe(false);
      expect(isYes('test_ye_s')).toBe(false);
      expect(isYes('test_no')).toBe(false);
    });
  });
});
