import { average, isValidPercentage, sequencedNumber } from '../../business/numbers';

describe('Numbers business logic', () => {
  it('sequencedNumber should return correct value', () => {
    expect(sequencedNumber(1)).toBe('1st');
    expect(sequencedNumber(2)).toBe('2nd');
    expect(sequencedNumber(3)).toBe('3rd');
    expect(sequencedNumber(4)).toBe('4th');
    expect(sequencedNumber(5)).toBe('5th');
    expect(sequencedNumber(6)).toBe('6th');
    expect(sequencedNumber(11)).toBe('11th');
    expect(sequencedNumber(12)).toBe('12th');
    expect(sequencedNumber(13)).toBe('13th');
    expect(sequencedNumber(111)).toBe('111th');
    expect(sequencedNumber(112)).toBe('112th');
    expect(sequencedNumber(113)).toBe('113th');
  });

  it('average should return correct value', () => {
    expect(average([1, 2, 3])).toBe(2);
  });

  it('isValidPercentage should return correct value', () => {
    expect(isValidPercentage()).toBe(true);
    expect(isValidPercentage(0)).toBe(true);
    expect(isValidPercentage(100)).toBe(true);
    expect(isValidPercentage(-5)).toBe(false);
    expect(isValidPercentage(105)).toBe(false);
  });
});
