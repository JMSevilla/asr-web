import { externalImageLoader } from '../../business/images';

describe('Business images logic', () => {
  describe('external image loader', () => {
    it('should generate url with quality and width parameters', () => {
      const src = 'random-url';
      const quality = 80;
      const width = 100;
      expect(externalImageLoader({ src, quality, width })).toBe('random-url?w=100&q=80');
    });

    it('should generate url with width parameter', () => {
      const src = 'random-url';
      const width = 100;
      expect(externalImageLoader({ src, width })).toBe('random-url?w=100');
    });
  });
});
