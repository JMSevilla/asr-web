import {
  capitalizeFirstLetter,
  hasWhiteSpace,
  isJSON,
  parseDelimitedList,
  parseStringToObject,
  removeTrailingSlash,
  toTitleCase,
} from '../../business/strings';

describe('Business strings logic', () => {
  describe('toTitleCase', () => {
    it('should capitalize string ', () => {
      expect(toTitleCase('text')).toBe('Text');
      expect(toTitleCase('tEXT')).toBe('Text');
      expect(toTitleCase('TEXT')).toBe('Text');
      expect(toTitleCase('texT TEXT')).toBe('Text Text');
      expect(toTitleCase('text text')).toBe('Text Text');
      expect(toTitleCase('texT TEXT')).toBe('Text Text');
      expect(toTitleCase("t'exT TEXT")).toBe("T'Ext Text");
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter', () => {
      const input = 'textText';
      const expectedOutput = 'TextText';
      expect(capitalizeFirstLetter(input)).toBe(expectedOutput);
    });
  });

  describe('hasWhiteSpace', () => {
    it('should check if exist white spaces', () => {
      expect(hasWhiteSpace('text with white spaces')).toBe(true);
      expect(hasWhiteSpace('texttexttext')).toBe(false);
      expect(hasWhiteSpace('texT TEXT')).toBe(true);
    });
  });

  describe('parseStringToObject', () => {
    it('should parse string to object', () => {
      expect(parseStringToObject('type=type;value=value')).toEqual({ type: 'type', value: 'value' });
      expect(parseStringToObject('journey_type=dblocktransferquote;page_key=t2_transfer_options;')).toEqual({
        journey_type: 'dblocktransferquote',
        page_key: 't2_transfer_options',
      });
    });
  });

  describe('removeTrailingSlash', () => {
    it('should remove trailing slash', () => {
      expect(removeTrailingSlash('text/')).toBe('text');
      expect(removeTrailingSlash('text//')).toBe('text/');
    });
  });

  describe('isJSON', () => {
    it('should check if string is JSON', () => {
      expect(isJSON('{"key": "value"}')).toBe(true);
      expect(isJSON('val')).toBe(false);
    });
  });

  describe('parseDelimitedList', () => {
    it('returns an empty array when envVal is undefined', () => {
      expect(parseDelimitedList(undefined, ';')).toEqual([]);
    });

    it('splits a semicolon-delimited string correctly', () => {
      const input = 'a;b;;c;';
      const input2 = '/a/;/b/;/c/';
      const result = parseDelimitedList(input, ';');
      const result2 = parseDelimitedList(input2, ';');
      expect(result).toEqual(['a', 'b', 'c']);
      expect(result2).toEqual(['/a/', '/b/', '/c/']);
    });

    it('splits a delimited string correctly with empty item', () => {
      const input = 'a,b, ,c,';
      const result = parseDelimitedList(input, ',');
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('trims whitespace around items', () => {
      const input = '  a  ; b ;c ; ';
      const result = parseDelimitedList(input, ';');
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('handles multi-character delimiters', () => {
      const input = 'a--b--c--';
      const result = parseDelimitedList(input, '--');
      expect(result).toEqual(['a', 'b', 'c']);
    });
  });
});
