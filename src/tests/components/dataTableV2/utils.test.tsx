import '@testing-library/jest-dom';
import { tableCellAlignToJustifyContent } from '../../../components/table/data-table/utils';

describe('Data Table Utils', () => {
  describe('tableCellAlignToJustifyContent', () => {
    it('should return flex-start when align is undefined', () => {
      expect(tableCellAlignToJustifyContent(undefined)).toBe('flex-start');
    });

    it('should return flex-start for align left', () => {
      expect(tableCellAlignToJustifyContent('left')).toBe('flex-start');
    });

    it('should return center for align center', () => {
      expect(tableCellAlignToJustifyContent('center')).toBe('center');
    });

    it('should return flex-end for align right', () => {
      expect(tableCellAlignToJustifyContent('right')).toBe('flex-end');
    });

    it('should return flex-start for align inherit', () => {
      expect(tableCellAlignToJustifyContent('inherit')).toBe('flex-start');
    });

    it('should return flex-start for align justify', () => {
      expect(tableCellAlignToJustifyContent('justify')).toBe('flex-start');
    });
  });
});
