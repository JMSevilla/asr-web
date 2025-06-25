import { getHrefLink } from '../../business/links';

jest.mock('../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

describe('Business links logic', () => {
  describe('getHrefLink', () => {
    it('should return same link if it starts with `mailto:`', () => {
      const link = 'mailto:email@email.email';

      expect(getHrefLink(link)).toBe(link);
    });

    it('should return same link if it starts with `tel:`', () => {
      const link = 'tel:XXX';

      expect(getHrefLink(link)).toBe(link);
    });

    it('should return empty string if link starts not with `mailto:` or `tel:`', () => {
      expect(getHrefLink('link')).toBe('');
    });

    it('should return empty string if link is undefined', () => {
      expect(getHrefLink(undefined)).toBe('');
    });
  });
});
