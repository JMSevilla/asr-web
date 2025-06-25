import { getUserBrowser, getUserPlatform } from '../../business/system';

describe('system', () => {
  describe('getUserPlatform', () => {
    it("should return 'Windows' if platform contains 'Win'", () => {
      // to avoid type error for global variable
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue('Win32');
      expect(getUserPlatform()).toBe('Windows');
    });

    it("should return 'Mac' if platform contains 'Mac'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue('MacIntel');
      expect(getUserPlatform()).toBe('Mac');
    });

    it("should return 'iPhone' if userAgent contains 'iPhone'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1 Mobile/15E148 Safari/604.1',
      );
      expect(getUserPlatform()).toBe('iPhone');
    });
    it("should return 'iPhone' if userAgent contains 'iPad'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (iPad; CPU OS 13_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1',
      );
      expect(getUserPlatform()).toBe('iPhone');
    });

    it("should return 'Android' if userAgent contains 'Android'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (Linux; Android 10; SM-G970F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36',
      );
      expect(getUserPlatform()).toBe('Android');
    });
  });

  describe('getUserBrowser', () => {
    it("should return 'Firefox' if userAgent contains 'Firefox'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; rv:88.0) Gecko/20100101 Firefox/88.0');
      expect(getUserBrowser()).toBe('Firefox');
    });

    it("should return 'Chrome' if userAgent contains 'Chrome'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      );
      expect(getUserBrowser()).toBe('Chrome');
    });

    it("should return 'Safari' if userAgent contains 'Safari'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
      );
      expect(getUserBrowser()).toBe('Safari');
    });

    it("should return 'Microsoft Edge' if userAgent contains 'Edge'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.37',
      );
      expect(getUserBrowser()).toBe('Microsoft Edge');
    });

    it("should return 'Opera' if userAgent contains 'Opera' or 'OPR'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 OPR/99.0.0.0',
      );
      expect(getUserBrowser()).toBe('Opera');
    });

    it("should return 'Internet Explorer' if userAgent contains 'Trident'", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko');
      expect(getUserBrowser()).toBe('Internet Explorer');
    });

    it("should return 'Unknown' if none of the conditions are met", () => {
      //@ts-ignore-next-line
      global.userAgent.mockReturnValue('Some other user agent');
      expect(getUserBrowser()).toBe('Unknown');
    });
  });
});
