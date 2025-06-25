import { isOpenAmPath, isSingleAuthPath, isSingleAuthReferrer, selectAuthMethod } from "../../core/auth-method-rules";
import { AUTH_METHODS } from "../../core/contexts/auth/types";
import { config } from "../../config";

jest.mock("../../config", () => ({
  config: {
    value: {
      SINGLE_AUTH_PATHS: '/sa/;',
      OPENAM_PATHS: '/login;/ssosuccess;/ssologout;/ssofailed;',
      SINGLE_AUTH_DOMAINS: 'ehr.com;'
    }
  }
}));

describe('Auth Method Selection', () => {

  describe('Pattern Matching', () => {
    it('should match single auth paths', () => {
      expect(isSingleAuthPath('/sa/login')).toBe(true);
      expect(isSingleAuthPath('/sample')).toBe(false);
      expect(isSingleAuthPath('/sa-mple')).toBe(false);
      expect(isSingleAuthPath('/login')).toBe(false);
    });

    it('should match openam paths', () => {
      expect(isOpenAmPath('/login')).toBe(true);
      expect(isOpenAmPath('/ssosuccess')).toBe(true);
      expect(isOpenAmPath('/sa/login')).toBe(false);
    });

    it('should match Single Auth referrer', () => {
      expect(isSingleAuthReferrer('https://ehr.com/path')).toBe(true);
      expect(isSingleAuthReferrer('https://test.ehr.com/path')).toBe(true);
      expect(isSingleAuthReferrer('https://other.com')).toBe(false);
    });
  });

  describe('Auth Method Selection Hierarchy', () => {
    describe('1. SingleAuth Paths (Highest Priority)', () => {
      it('should use SingleAuth for /sa/* paths regardless of referrer or current method', () => {
        ['/sa/login', '/sa/register', '/sa/logout'].forEach(path => {
          const result = selectAuthMethod({
            path,
            referrer: 'https://other.com',
            currentMethod: AUTH_METHODS.OPENAM,
          });
          expect(result).toBe(AUTH_METHODS.SINGLE_AUTH);
        });
      });
    });

    describe('2. OpenAM Paths (Second Priority)', () => {
      it('should use OpenAM for specific paths even with SingleAuth referrer', () => {
        ['/login', '/ssosuccess', '/ssologout', '/ssofailed'].forEach(path => {
          const result = selectAuthMethod({
            path,
            referrer: 'https://ehr.com',
            currentMethod: AUTH_METHODS.SINGLE_AUTH,
          });
          expect(result).toBe(AUTH_METHODS.OPENAM);
        });
      });
    });

    describe('3. SingleAuth Referrer (Third Priority)', () => {
      it('should use SingleAuth for ehr.com referrer if no path rules match', () => {
        const result = selectAuthMethod({
          path: '/hub',
          referrer: 'https://ehr.com',
          currentMethod: AUTH_METHODS.OPENAM,
        });
        expect(result).toBe(AUTH_METHODS.SINGLE_AUTH);
      });
    });

    describe('4. Current Method (Fourth Priority)', () => {
      it('should maintain current method if no other rules match', () => {
        const result = selectAuthMethod({
          path: '/hub',
          referrer: 'https://other.com',
          currentMethod: AUTH_METHODS.SINGLE_AUTH,
        });
        expect(result).toBe(AUTH_METHODS.SINGLE_AUTH);
      });
    });

    describe('5. Default to OpenAM (Lowest Priority)', () => {
      it('should default to OpenAM when no conditions match', () => {
        const result = selectAuthMethod({
          path: '/hub',
          referrer: 'https://other.com',
          currentMethod: undefined,
        });
        expect(result).toBe(AUTH_METHODS.OPENAM);
      });
    });

    describe('Complex Scenarios', () => {
      it('should handle empty referrer correctly', () => {
        const result = selectAuthMethod({
          path: '/hub',
          referrer: '',
          currentMethod: undefined,
        });
        expect(result).toBe(AUTH_METHODS.OPENAM);
      });

      it('should handle undefined referrer correctly', () => {
        const result = selectAuthMethod({
          path: '/hub',
          referrer: undefined,
          currentMethod: undefined,
        });
        expect(result).toBe(AUTH_METHODS.OPENAM);
      });

      it('should maintain current SingleAuth session for non-specific paths', () => {
        const result = selectAuthMethod({
          path: '/profile',
          referrer: 'https://other.com',
          currentMethod: AUTH_METHODS.SINGLE_AUTH,
        });
        expect(result).toBe(AUTH_METHODS.SINGLE_AUTH);
      });
    });
  });
});