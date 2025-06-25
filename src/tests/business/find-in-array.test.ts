import {
  arraysAreEqual,
  findKeysWithAsterisk,
  findLongestArrayInArray,
  findRequiredValueByKey,
  findValueByKey,
  stringsExistInArray,
} from '../../business/find-in-array';

const PARAMETERS = [
  {
    key: 'parameter1',
    value: 'parameter1 value',
  },
  {
    key: 'parameter2',
    value: 'parameter2 value',
  },
];

describe('Business find-in-array logic', () => {
  describe('findValueByKey', () => {
    it('should find existing parameter value', () => {
      expect(findValueByKey('parameter1', PARAMETERS)).toBe(PARAMETERS[0].value);
    });

    it('should return undefined if parameter not found', () => {
      expect(findValueByKey('random', PARAMETERS)).toBe(undefined);
    });

    it('should return undefined if parameters not exist', () => {
      expect(findValueByKey('random', undefined)).toBe(undefined);
    });
  });

  describe('findRequiredValueByKey', () => {
    it('should find existing parameter value', () => {
      expect(findRequiredValueByKey('parameter2', PARAMETERS)).toBe(PARAMETERS[1].value);
    });

    it('should throw error if parameter not exit', () => {
      expect(() => findRequiredValueByKey('random', PARAMETERS)).toThrow(
        'Required parameter random was not found in CMS',
      );
    });
  });

  describe('stringsExistInArray', () => {
    it('should return true if strings exist in array', () => {
      expect(stringsExistInArray(['a', 'b'], ['a', 'b', 'c'])).toBe(true);
    });

    it('should return false if strings not exist in array', () => {
      expect(stringsExistInArray(['a', 'b', 'c'], ['d', 'e'])).toBe(false);
    });
  });

  describe('findLongestArrayInArray', () => {
    it('should return longest array', () => {
      expect(findLongestArrayInArray([[1, 2], [1, 2, 3], [1]])).toEqual([1, 2, 3]);
    });
  });

  describe('findKeysWithAsterisk', () => {
    it('should return an empty array if no keys contain an asterisk', () => {
      const objectsArray = [
        { age: '50', assetValue: null },
        { age: '58', assetValue: '100000' },
        { age: '30', assetValue: '200000' },
      ];
      const result = findKeysWithAsterisk(objectsArray);
      expect(result).toEqual([]);
    });

    it('should correctly identify keys with values containing an asterisk', () => {
      const objectsArray = [
        { age: '5*', assetValue: null },
        { age: '58', assetValue: '100*000' },
        { age: '30', assetValue: '200000' },
      ];
      const result = findKeysWithAsterisk(objectsArray);
      expect(result).toEqual([
        { item: { age: '5*', assetValue: null }, key: 'age' },
        { item: { age: '58', assetValue: '100*000' }, key: 'assetValue' },
      ]);
    });
  });

  describe('arraysAreEqual', () => {
    it('should compare arrays correctly', () => {
      const array1 = ['FINAF', 'RSTVA'];
      const array2 = ['FINAF'];
      const result = arraysAreEqual(array1, array2);
      expect(result).toEqual(false);
      expect(arraysAreEqual(['FINAF', 'RSTVA'], ['RSTVA', 'FINAF'])).toEqual(true);
      expect(arraysAreEqual(['RSTVA', 'FINAF'], ['RSTVA', 'FINAF'])).toEqual(true);
      expect(arraysAreEqual(['FINAF'], ['FINAF'])).toEqual(true);
    });
  });
});
