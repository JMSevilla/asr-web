import { MenuItem } from '../../../api/content/types/menu';

export const sortByOrderNo = (a: MenuItem, b: MenuItem) => a.elements.orderNo.value - b.elements.orderNo.value;

export const filterBySide = (side: 'Left' | 'Right') => (item: MenuItem) =>
  item.elements.position.value?.selection === side;

export const filterMenuItems = (item: MenuItem) => item.elements?.position?.value?.selection !== 'Account';
