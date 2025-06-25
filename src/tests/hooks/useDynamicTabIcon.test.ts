import { useCachedCmsAsset } from '../../core/hooks/useCmsAsset';
import { useDynamicTabIcon } from '../../core/hooks/useDynamicTabIcon';
import { renderHook } from '../common';

jest.mock('../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../core/hooks/useCmsAsset');

describe('useDynamicTabIcon', () => {
  it('should set the tab icon', () => {
    const tabIcon = 'https://example.com/tabIcon';
    (useCachedCmsAsset as jest.Mock).mockReturnValueOnce(tabIcon);
    const tenant = { tabIcon: { url: 'url' } } as any;
    renderHook(() => useDynamicTabIcon(tenant));
    expect(document.querySelector('link')?.href).toBe(tabIcon);
  });
});
