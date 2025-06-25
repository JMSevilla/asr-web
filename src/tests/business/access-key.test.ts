import { doesAccessKeyHaveWordingFlag, parseContentAccessKey } from '../../business/access-key';
import { logger } from '../../core/datadog-logs';

// Mock the logger
jest.mock('../../core/datadog-logs', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('Business access-key logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('parseContentAccessKey', () => {
    it('should return undefined for undefined input', () => {
      const result = parseContentAccessKey(undefined);
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty string', () => {
      const result = parseContentAccessKey('');
      expect(result).toBeUndefined();
    });

    it('should parse valid JSON string correctly', () => {
      const validJson = JSON.stringify({
        currentAge: '25Y6M',
        memberStatus: 'active',
        wordingFlags: ['GMP', 'GMPINPAY'],
        hasAdditionalContributions: true,
        numberOfProtectedQuotes: 2,
      });

      const result = parseContentAccessKey(validJson);

      expect(result).toEqual({
        currentAge: '25Y6M',
        memberStatus: 'active',
        wordingFlags: ['GMP', 'GMPINPAY'],
        hasAdditionalContributions: true,
        numberOfProtectedQuotes: 2,
      });
    });

    it('should parse minimal JSON with just one field', () => {
      const minimalJson = '{"tenantUrl":"test.com"}';
      const result = parseContentAccessKey(minimalJson);

      expect(result).toEqual({
        tenantUrl: 'test.com',
      });
    });

    it('should parse JSON with all ContentAccessKey fields', () => {
      const fullJson = JSON.stringify({
        currentAge: '30Y2M',
        dbCalculationStatus: 'complete',
        dcLifeStage: 'accumulation',
        hasAdditionalContributions: false,
        hasProtectedQuote: true,
        isCalculationSuccessful: true,
        isWebChatEnabled: false,
        lifeStage: 'working',
        memberStatus: 'active',
        numberOfProtectedQuotes: 1,
        retirementApplicationStatus: 'pending',
        schemeType: 'DC',
        tenantUrl: 'example.com',
        transferApplicationStatus: 'approved',
        wordingFlags: ['FLAG1', 'FLAG2', 'FLAG3'],
      });

      const result = parseContentAccessKey(fullJson);

      expect(result).toEqual({
        currentAge: '30Y2M',
        dbCalculationStatus: 'complete',
        dcLifeStage: 'accumulation',
        hasAdditionalContributions: false,
        hasProtectedQuote: true,
        isCalculationSuccessful: true,
        isWebChatEnabled: false,
        lifeStage: 'working',
        memberStatus: 'active',
        numberOfProtectedQuotes: 1,
        retirementApplicationStatus: 'pending',
        schemeType: 'DC',
        tenantUrl: 'example.com',
        transferApplicationStatus: 'approved',
        wordingFlags: ['FLAG1', 'FLAG2', 'FLAG3'],
      });
    });

    it('should return undefined and log error for invalid JSON', () => {
      const invalidJson = '{"invalid": json}';
      const result = parseContentAccessKey(invalidJson);

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith('Error parsing content access key:', expect.any(Error));
    });

    it('should return undefined and log error for malformed JSON', () => {
      const malformedJson = '{currentAge: 25Y6M}';
      const result = parseContentAccessKey(malformedJson);

      expect(result).toBeUndefined();
      expect(logger.error).toHaveBeenCalledWith('Error parsing content access key:', expect.any(Error));
    });

    it('should handle JSON with null values', () => {
      const jsonWithNulls = '{"currentAge": null, "memberStatus": "active"}';
      const result = parseContentAccessKey(jsonWithNulls);

      expect(result).toEqual({
        currentAge: null,
        memberStatus: 'active',
      });
    });
  });

  describe('doesAccessKeyHaveWordingFlag', () => {
    it('should return false for undefined input', () => {
      const result = doesAccessKeyHaveWordingFlag(undefined, 'TEST_FLAG');
      expect(result).toBe(false);
    });

    it('should return false for empty string input', () => {
      const result = doesAccessKeyHaveWordingFlag('', 'TEST_FLAG');
      expect(result).toBe(false);
    });

    it('should return false for invalid JSON input', () => {
      const result = doesAccessKeyHaveWordingFlag('invalid json', 'TEST_FLAG');
      expect(result).toBe(false);
    });

    it('should return false when access key has no wordingFlags property', () => {
      const accessKey = '{"currentAge": "25Y6M", "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'TEST_FLAG');
      expect(result).toBe(false);
    });

    it('should return false when wordingFlags is empty array', () => {
      const accessKey = '{"wordingFlags": [], "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'TEST_FLAG');
      expect(result).toBe(false);
    });

    it('should return false when wordingFlags is null', () => {
      const accessKey = '{"wordingFlags": null, "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'TEST_FLAG');
      expect(result).toBe(false);
    });

    it('should return false when flag is not in wordingFlags', () => {
      const accessKey = '{"wordingFlags": ["GMP", "GMPINPAY"], "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'MISSING_FLAG');
      expect(result).toBe(false);
    });

    it('should return true when flag exists in wordingFlags', () => {
      const accessKey = '{"wordingFlags": ["GMP", "GMPINPAY", "TEST_FLAG"], "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'TEST_FLAG');
      expect(result).toBe(true);
    });

    it('should return true when flag exists as first item in wordingFlags', () => {
      const accessKey = '{"wordingFlags": ["FIRST_FLAG", "GMP", "GMPINPAY"], "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'FIRST_FLAG');
      expect(result).toBe(true);
    });

    it('should return true when flag exists as last item in wordingFlags', () => {
      const accessKey = '{"wordingFlags": ["GMP", "GMPINPAY", "LAST_FLAG"], "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'LAST_FLAG');
      expect(result).toBe(true);
    });

    it('should return true when flag exists as only item in wordingFlags', () => {
      const accessKey = '{"wordingFlags": ["ONLY_FLAG"], "memberStatus": "active"}';
      const result = doesAccessKeyHaveWordingFlag(accessKey, 'ONLY_FLAG');
      expect(result).toBe(true);
    });

    it('should be case sensitive when checking flags', () => {
      const accessKey = '{"wordingFlags": ["test_flag"], "memberStatus": "active"}';

      expect(doesAccessKeyHaveWordingFlag(accessKey, 'test_flag')).toBe(true);
      expect(doesAccessKeyHaveWordingFlag(accessKey, 'TEST_FLAG')).toBe(false);
      expect(doesAccessKeyHaveWordingFlag(accessKey, 'Test_Flag')).toBe(false);
    });

    it('should handle complex access key with multiple properties', () => {
      const accessKey = JSON.stringify({
        currentAge: '30Y2M',
        dbCalculationStatus: 'complete',
        hasAdditionalContributions: true,
        memberStatus: 'active',
        wordingFlags: ['GMP', 'GMPINPAY', 'COMPLEX_FLAG', 'ANOTHER_FLAG'],
        tenantUrl: 'test.com',
      });

      expect(doesAccessKeyHaveWordingFlag(accessKey, 'COMPLEX_FLAG')).toBe(true);
      expect(doesAccessKeyHaveWordingFlag(accessKey, 'MISSING_FLAG')).toBe(false);
    });
  });
});
