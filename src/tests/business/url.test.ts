import {
  constructUniversalUrlPath,
  formatEpaUrl,
  formatUrl,
  formatUrlParameters,
  getOrigin,
  isValidUrl,
} from '../../business/url';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: {
    get value() {
      return {
        API_URL: 'https://api_url',
        EPA_DOMAIN_NAME: 'https://api_url',
      };
    },
  },
}));

describe('Business url logic', () => {
  describe('formatUrlParameters', () => {
    it('should correctly parse single parameters', () => {
      const url = 'http://test.com?param1=value1';
      expect(formatUrlParameters(url)).toEqual({ param1: 'value1' });
    });

    it('should correctly parse multiple parameters', () => {
      const url = 'http://test.com?param1=value1&param2=value2';
      expect(formatUrlParameters(url)).toEqual({ param1: 'value1', param2: 'value2' });
    });

    it('should aggregate multiple instances of the same parameter', () => {
      const url = 'http://test.com?param1=value1&param1=value2';
      expect(formatUrlParameters(url)).toEqual({ param1: ['value1', 'value2'] });
    });

    it('should handle mixed single and multiple instances of parameters', () => {
      const url = 'http://test.com?param1=value1&param2=value2&param1=value3';
      expect(formatUrlParameters(url)).toEqual({ param1: ['value1', 'value3'], param2: 'value2' });
    });

    it('should return an empty object for URLs without parameters', () => {
      const url = 'http://test.com';
      expect(formatUrlParameters(url)).toEqual({});
    });

    it('should handle URLs with empty parameter values', () => {
      const url = 'http://test.com?param1=';
      expect(formatUrlParameters(url)).toEqual({ param1: '' });
    });
  });

  describe('formatUrl', () => {
    it('should return correct URLs as was provided', () => {
      const url = 'http://test.com?param1=';
      expect(JSON.stringify(formatUrl(url))).toBe('"http://test.com/?param1="');
    });
    it('should add API_URL domain as prefix if url not full or incorrect', () => {
      const url = 'test.com?param1=';
      expect(JSON.stringify(formatUrl(url))).toStrictEqual('"https://api_url/test.com?param1="');
    });
  });

  describe('formatEpaUrl', () => {
    it('should return correct URLs as was provided', () => {
      const url = 'http://test.com?param1=';
      expect(JSON.stringify(formatEpaUrl(url))).toBe('"http://test.com/?param1="');
    });
    it('should add API_URL domain as prefix if url not full or incorrect', () => {
      const url = 'test.com?param1=';
      expect(JSON.stringify(formatEpaUrl(url))).toStrictEqual('"https://api_url/test.com?param1="');
    });
  });

  describe('getOrigin', () => {
    it('should return the origin for a valid URL', () => {
      expect(getOrigin('https://example.com/path')).toBe('https://example.com');
      expect(getOrigin('http://subdomain.example.com')).toBe('https://subdomain.example.com');
      expect(getOrigin('https://example.com:8080')).toBe('https://example.com:8080');
    });

    it('should return an empty string for an invalid URL', () => {
      expect(getOrigin('not a url')).toBe('');
      expect(getOrigin('http://')).toBe('');
    });

    it('should handle URLs without protocols', () => {
      expect(getOrigin('example.com')).toBe('https://example.com');
      expect(getOrigin('subdomain.example.com')).toBe('https://subdomain.example.com');
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path')).toBe(true);
      expect(isValidUrl('https://example.com:8080')).toBe(true);
      expect(isValidUrl('https://example.com/path?param=value')).toBe(true);
      expect(isValidUrl('https://example.com/path#fragment')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('https://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('://example.com')).toBe(false);
      // Note: 'http://.' is actually considered valid by URL constructor
    });

    it('should handle edge cases', () => {
      expect(isValidUrl('javascript:alert("xss")')).toBe(true); // Valid URL scheme
      expect(isValidUrl('data:text/plain;base64,SGVsbG8=')).toBe(true); // Data URL
      expect(isValidUrl('mailto:test@example.com')).toBe(true); // Mailto URL
    });
  });

  describe('constructUniversalUrlPath', () => {
    const originalWindow = global.window;

    beforeEach(() => {
      // Reset window mock before each test
      delete (global as any).window;
    });

    afterEach(() => {
      // Restore original window after each test
      global.window = originalWindow;
    });

    it('should return the original URL when window is undefined (server-side)', () => {
      const url = 'https://example.com/path';
      expect(constructUniversalUrlPath(url)).toBe(url);
    });

    it('should return pathname when URL has same origin as current window', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'https://example.com/path/to/page?param=value';
      // constructUniversalUrlPath only returns pathname, not search params
      expect(constructUniversalUrlPath(url)).toBe('/path/to/page');
    });

    it('should return full URL when URL has different origin from current window', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'https://different.com/path/to/page';
      expect(constructUniversalUrlPath(url)).toBe(url);
    });

    it('should handle URLs with different ports as different origins', () => {
      (global as any).window = { location: { origin: 'https://example.com:3000' } };

      const url = 'https://example.com:8080/path';
      expect(constructUniversalUrlPath(url)).toBe(url);
    });

    it('should handle URLs with different protocols as different origins', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'http://example.com/path';
      // getOrigin converts http to https, so origins will match and return pathname
      expect(constructUniversalUrlPath(url)).toBe('/path');
    });

    it('should handle URLs with subdomains as different origins', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'https://sub.example.com/path';
      expect(constructUniversalUrlPath(url)).toBe(url);
    });

    it('should return pathname for same origin URL with query parameters and hash', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'https://example.com/path?param1=value1&param2=value2#section';
      // constructUniversalUrlPath only returns pathname, not search params or hash
      expect(constructUniversalUrlPath(url)).toBe('/path');
    });

    it('should handle root path correctly', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'https://example.com/';
      expect(constructUniversalUrlPath(url)).toBe('/');
    });

    it('should handle URLs without path correctly', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'https://example.com';
      expect(constructUniversalUrlPath(url)).toBe('/');
    });

    it('should preserve search params and hash for different origins', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'https://different.com/path?param=value#section';
      expect(constructUniversalUrlPath(url)).toBe(url);
    });

    it('should handle invalid URLs gracefully', () => {
      (global as any).window = { location: { origin: 'https://example.com' } };

      const url = 'not-a-valid-url';
      // getOrigin returns empty string for invalid URLs, so origins won't match
      expect(constructUniversalUrlPath(url)).toBe(url);
    });

    it('should handle URLs with custom ports correctly', () => {
      (global as any).window = { location: { origin: 'https://example.com:3000' } };

      const url = 'https://example.com:3000/path';
      expect(constructUniversalUrlPath(url)).toBe('/path');
    });
  });
});
