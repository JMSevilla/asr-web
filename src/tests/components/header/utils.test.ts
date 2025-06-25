import { MenuItem } from '../../../api/content/types/menu';
import { filterBySide, filterMenuItems, sortByOrderNo } from '../../../components/header/navigationMenu/utils';

describe('Navigation Menu Utils', () => {
  describe('sortByOrderNo', () => {
    it('should sort menu items by order number', () => {
      const item1 = { elements: { orderNo: { value: 2 } } } as MenuItem;
      const item2 = { elements: { orderNo: { value: 1 } } } as MenuItem;
      const items = [item1, item2];

      items.sort(sortByOrderNo);

      expect(items).toEqual([item2, item1]);
    });
  });

  describe('filterBySide', () => {
    it('should filter menu items by side', () => {
      const item1 = { elements: { position: { value: { selection: 'Left' } } } } as MenuItem;
      const item2 = { elements: { position: { value: { selection: 'Right' } } } } as MenuItem;
      const items = [item1, item2];

      const filteredItems = items.filter(filterBySide('Left'));

      expect(filteredItems).toEqual([item1]);
    });
  });
  describe('filterMenuItems', () => {
    it('should filter menu items without records', () => {
      const item1 = { elements: { position: { value: { selection: 'Left' } } } } as MenuItem;
      const item2 = { elements: { position: { value: { selection: 'Right' } } } } as MenuItem;
      const item3 = { elements: { position: { value: { selection: 'Account' } } } } as MenuItem;
      const items = [item1, item2, item3];

      const filteredItems = items.filter(filterMenuItems);

      expect(filteredItems).toEqual([item1, item2]);
    });
  });
});
