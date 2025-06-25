import { PageContentValues } from '../../api/content/types/page';
import { shouldReduceSpaceBetweenCmsBlocks } from '../../business/cms-spacing';

const blocks: PageContentValues[] = [
  {
    elements: {},
    type: 'back_button',
    name: 'block',
  },
  {
    elements: {},
    type: 'random block',
    name: 'block',
  },
  {
    elements: {},
    type: 'Message',
    name: 'block',
  },
  {
    elements: {},
    type: 'Message',
    name: 'block',
  },
  {
    elements: {},
    type: 'random block',
    name: 'block',
  },
];

describe('CMS spacing logic', () => {
  describe('shouldReduceSpaceBetweenCmsBlocks', () => {
    it('should return true if current index points to a back button block', () => {
      expect(shouldReduceSpaceBetweenCmsBlocks(0, blocks)).toBe(true);
    });

    it('should return false if current index points to a block not mentioned in the shouldReduceSpaceBetweenCmsBlocks function', () => {
      expect(shouldReduceSpaceBetweenCmsBlocks(1, blocks)).toBe(false);
    });

    it('should return true if current index points to a message block and the next block is also message type', () => {
      expect(shouldReduceSpaceBetweenCmsBlocks(2, blocks)).toBe(true);
    });

    it('should return false if current index points to a message block and the next block type is not message', () => {
      expect(shouldReduceSpaceBetweenCmsBlocks(3, blocks)).toBe(false);
    });
  });
});
