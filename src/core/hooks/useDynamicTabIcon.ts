import { useEffect } from 'react';
import { CmsTenant } from '../../api/content/types/tenant';
import { useCachedCmsAsset } from './useCmsAsset';

/**
 * Dynamically sets the tab icon for the current page.
 * @param tenant The tenant to use for the tab icon. The type of the icon file uploaded in CMS must be .png.
 * @example
 * useDynamicTabIcon(tenant);
 */
export const useDynamicTabIcon = (tenant: CmsTenant) => {
  const tabIcon = useCachedCmsAsset(tenant.tabIcon?.url);
  useEffect(() => {
    if (typeof window === 'undefined' || !tabIcon) return;
    const head = document.querySelector('head');

    const tabIconElement = document.createElement('link');
    tabIconElement.rel = 'icon';
    tabIconElement.type = 'image/png';
    tabIconElement.href = tabIcon;

    const tabIconElementMobile = document.createElement('link');
    tabIconElementMobile.rel = 'apple-touch-icon';
    tabIconElementMobile.type = 'image/png';
    tabIconElementMobile.href = tabIcon;

    head?.appendChild(tabIconElement);
    return () => {
      head?.removeChild(tabIconElement);
    };
  }, [tabIcon]);
};
