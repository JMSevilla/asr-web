import { formatResourceExternalLink } from '../../business/resources';

describe('Business resources logic', () => {
  describe('formatResourceExternalLink', () => {
    it('should return the url if it is not a youtube embed url', () => {
      const url = 'https://www.google.com';
      expect(formatResourceExternalLink(url)).toBe(url);
    });

    it('should return the youtube url if it is a youtube embed url', () => {
      const url = 'https://www.youtube.com/embed/1234';
      expect(formatResourceExternalLink(url)).toBe('https://www.youtube.com/watch?v=1234');
    });
  });
});
