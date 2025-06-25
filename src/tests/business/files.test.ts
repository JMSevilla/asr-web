import { areFilesSame, fileNameFromResponse, formatBytes, formatTagKey, reconstructCombinedTags, splitCombinedTags } from '../../business/files';

describe('Business files logic', () => {
  describe('areFilesSame', () => {
    it('should return true when files are same', () => {
      const file1 = new File([''], 'file1', { type: 'text/plain' });
      const file2 = new File([''], 'file1', { type: 'text/plain' });
      expect(areFilesSame(file1, file2)).toStrictEqual(true);
    });

    it('should return false when files are not same', () => {
      const file1 = new File([''], 'file1', { type: 'text/plain' });
      const file2 = new File([''], 'file2', { type: 'text/plain' });
      expect(areFilesSame(file1, file2)).toStrictEqual(false);
    });
  });

  describe('formatBytes', () => {
    it('should return correct value', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(1)).toBe('1 B');
      expect(formatBytes(1000)).toBe('1 KB');
      expect(formatBytes(1000000)).toBe('1 MB');
      expect(formatBytes(1000000000)).toBe('1 GB');
      expect(formatBytes(1000000000000)).toBe('1 TB');
    });
  });

  describe('fileNameFromResponse', () => {
    it('should return correct value', () => {
      const response = { headers: { 'content-disposition': 'attachment; filename="test.txt"' } };
      expect(fileNameFromResponse(response as any)).toBe('test.txt');
    });

    it('should return undefined when content-disposition is not present', () => {
      const response = { headers: {} };
      expect(fileNameFromResponse(response as any)).toBe(undefined);
    });
  });

  describe('reconstructCombinedTags', () => {
    it('should return matching combined tags when all individual tags exist in fileTags', () => {
      const validTagsList = ["LTAFR,ROLFR", "FORMX", "FORM1"];
      const fileTags = ["ROLFR", "LTAFR", "FORM1"];

      const result = reconstructCombinedTags(validTagsList, fileTags);

      expect(result).toEqual(["LTAFR,ROLFR", "FORM1"]);
    });

    it('should return only the matching tags even if fileTags are in a different order', () => {
      const validTagsList = ["LTAFR,ROLFR", "FORMX", "FORM1"];
      const fileTags = ["FORM1", "LTAFR", "ROLFR"];

      const result = reconstructCombinedTags(validTagsList, fileTags);

      expect(result).toEqual(["LTAFR,ROLFR", "FORM1"]);
    });

    it('should ignore case and match tags regardless of letter case', () => {
      const validTagsList = ["LTAFR,ROLFR", "FORMX", "FORM1"];
      const fileTags = ["rolfr", "ltafr", "form1"];

      const result = reconstructCombinedTags(validTagsList, fileTags);

      expect(result).toEqual(["LTAFR,ROLFR", "FORM1"]);
    });

    it('should return an empty array if no tags match', () => {
      const validTagsList = ["LTAFR,ROLFR", "FORMX", "FORM1"];
      const fileTags = ["FORM2", "ROLFR"];

      const result = reconstructCombinedTags(validTagsList, fileTags);

      expect(result).toEqual([]);
    });

    it('should return only the matching combined tags and ignore partial matches', () => {
      const validTagsList = ["LTAFR,ROLFR", "FORM1", "ROLFR"];
      const fileTags = ["ROLFR", "FORM1"];

      const result = reconstructCombinedTags(validTagsList, fileTags);

      // Only "FORM1" and "ROLFR" should match, "LTAFR,ROLFR" is ignored because "LTAFR" is missing
      expect(result).toEqual(["FORM1", "ROLFR"]);
    });

    it('should handle empty validTagsList and fileTags', () => {
      const validTagsList: string[] = [];
      const fileTags: string[] = [];

      const result = reconstructCombinedTags(validTagsList, fileTags);

      expect(result).toEqual([]);
    });

    it('should handle empty tags in fileTags and return an empty array', () => {
      const validTagsList = ["LTAFR,ROLFR", "FORMX", "FORM1"];
      const fileTags: string[] = [];

      const result = reconstructCombinedTags(validTagsList, fileTags);

      expect(result).toEqual([]);
    });
  });

  describe('formatTagKey', () => {
    it('should replace commas with underscores in a tag', () => {
      const tag = "LTAFR,ROLFR";
      const result = formatTagKey(tag);
      expect(result).toBe("LTAFR_ROLFR");
    });

    it('should return the same string if no commas are present', () => {
      const tag = "FORM1";
      const result = formatTagKey(tag);
      expect(result).toBe("FORM1");
    });

    it('should handle an empty string', () => {
      const tag = "";
      const result = formatTagKey(tag);
      expect(result).toBe("");
    });
  });

  describe('splitCombinedTags', () => {
    it('should split combined tags separated by commas and return individual tags', () => {
      const tags = ["LTAFR,ROLFR", "FORM1"];
      const result = splitCombinedTags(tags);
      expect(result).toEqual(["LTAFR", "ROLFR", "FORM1"]);
    });

    it('should return the same array if there are no commas in any of the tags', () => {
      const tags = ["FORM1", "FORM2"];
      const result = splitCombinedTags(tags);
      expect(result).toEqual(["FORM1", "FORM2"]);
    });

    it('should handle an empty array and return an empty array', () => {
      const tags: string[] = [];
      const result = splitCombinedTags(tags);
      expect(result).toEqual([]);
    });

    it('should handle a tag with multiple commas and split it into multiple tags', () => {
      const tags = ["LTAFR,ROLFR,FORM1"];
      const result = splitCombinedTags(tags);
      expect(result).toEqual(["LTAFR", "ROLFR", "FORM1"]);
    });

    it('should handle a mixture of single and combined tags', () => {
      const tags = ["LTAFR,ROLFR", "FORM1", "FORM2,FORM3"];
      const result = splitCombinedTags(tags);
      expect(result).toEqual(["LTAFR", "ROLFR", "FORM1", "FORM2", "FORM3"]);
    });
  });
});
