import { isServiceDisabled, isServiceEnabled } from '../../business/service-toggle';

jest.mock('../../config', () => ({
  config: {
    value: { SUPPRESS_RECAPTCHA: 'false', SUPPRESS_OTPCHECK: 'true' },
  },
}));

describe('Business Service Toggle logic', () => {
  describe('isServiceEnabled', () => {
    it('should return true when the service is enabled', () => {
      expect(isServiceEnabled('RECAPTCHA')).toBe(true);
    });
    it('should return false when the service is disabled', () => {
      expect(isServiceEnabled('OTPCHECK')).toBe(false);
    });
  });

  describe('isServiceDisabled', () => {
    it('should return false when the service is enabled', () => {
      expect(isServiceDisabled('RECAPTCHA')).toBe(false);
    });
    it('should return true when the service is disabled', () => {
      expect(isServiceDisabled('OTPCHECK')).toBe(true);
    });
  });
});
