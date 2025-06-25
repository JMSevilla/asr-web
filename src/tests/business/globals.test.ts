import { CmsGlobals } from '../../api/content/types/globals';
import {
  extractClassifierFromGlobals,
  extractClassifierItemValueFromGlobals,
  extractLabelByKey,
  extractLabelFromGlobals,
  extractPreloadedLabelFromGlobals,
} from '../../business/globals';

const GLOBALS: CmsGlobals = {
  labels: [
    {
      elements: {
        labelKey: { elementType: 'type', value: 'test-label' },
        labelText: { elementType: '', value: 'Test Label' },
        linkTarget: { elementType: 'type', value: 'link target' },
      },
      type: 'Label',
    },
  ],
  classifiers: [
    {
      type: 'Classifier',
      elements: {
        classifierKey: { value: 'key' },
        classifierItem: {
          values: [
            { key: { value: 'key1' }, value: { value: 'value1' } },
            { key: { value: 'key2' }, value: { value: 'value2' } },
          ],
        },
        assetItems: {
          values: [
            { key: { value: 'key1' }, value: { url: 'url1' } },
            { key: { value: 'key2' }, value: { url: 'url2' } },
          ],
        },
      },
    },
  ],
};

describe('Business globals logic', () => {
  describe('extractLabelFromGlobals', () => {
    it('should return empty string if parameter not found', () => {
      expect(extractLabelFromGlobals('random', GLOBALS)).toBe('');
    });

    it('should find existing parameter value', () => {
      expect(extractLabelFromGlobals('test-label', GLOBALS)).toBe('Test Label');
    });
  });

  describe('extractPreloadedLabelFromGlobals', () => {
    it('should return empty string if parameter not found', () => {
      expect(extractPreloadedLabelFromGlobals('random')).toBe('[[random]]');
    });

    it('should find existing parameter value', () => {
      expect(extractPreloadedLabelFromGlobals('test-label', GLOBALS)).toBe('Test Label');
    });
  });

  describe('extractClassifierFromGlobals', () => {
    it('should return null if no classifier found', () => {
      const globals: CmsGlobals = { labels: [], classifiers: [] };
      expect(extractClassifierFromGlobals('key', globals)).toBeUndefined();
    });

    it('should return classifier if found', () => {
      expect(extractClassifierFromGlobals('key', GLOBALS)).toEqual(
        GLOBALS.classifiers![0].elements.classifierItem.values,
      );
    });
  });

  describe('extractClassifierItemValueFromGlobals', () => {
    it('should return null if no classifier found', () => {
      const globals: CmsGlobals = { labels: [], classifiers: [] };
      expect(extractClassifierItemValueFromGlobals('key', 'key1', globals)).toBeUndefined();
    });

    it('should return null if no classifier item found', () => {
      expect(extractClassifierItemValueFromGlobals('key', 'key3', GLOBALS)).toBeUndefined();
    });

    it('should return classifier item value if found', () => {
      expect(extractClassifierItemValueFromGlobals('key', 'key1', GLOBALS)).toBe('value1');
    });
  });

  describe('extractLabelByKey', () => {
    it('should return provided key if parameter not found', () => {
      expect(extractLabelByKey(GLOBALS, 'random')).toBe(`[[label:random]]`);
    });

    it('should find existing parameter value', () => {
      expect(extractLabelByKey(GLOBALS, 'test-label')).toBe('Test Label');
    });
  });
});
