import { useEffect, useState } from 'react';
import { BackgroundConfigItem, BackgroundConfigItemElement } from '../../../api/content/types/page';
import { CmsTenant } from '../../../api/content/types/tenant';
import { parseBackgroundColor } from '../../../cms/parse-cms';

/**
 * Finds the middle offset of the first matching separator element from the provided IDs
 */
const findSeparatorElementMiddleOffset = (separatorElementsIds: string[]): number | string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const element = separatorElementsIds.reduce<HTMLElement | null>(
    (found, id) => found ?? document.getElementById(id),
    null,
  );

  const headerHeight = document.querySelector('header')?.offsetHeight ?? 0;

  if (!element) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('Separator element by ID not found. Page top background will take 50% of the page height.');
    }
    return `calc(50% + ${headerHeight / 2}px)`;
  }

  const rect = element.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const absoluteTop = rect.top + scrollTop;
  const height = element.offsetHeight ?? 0;

  return absoluteTop + height * 0.5;
};

const parseSeparatorIds = (colorSeparatorIdValue?: string): string[] =>
  colorSeparatorIdValue
    ?.split(';')
    .map(v => v.trim())
    .filter(Boolean) ?? [];

const createResizeObserver = (callback: () => void): ResizeObserver | null =>
  typeof ResizeObserver !== 'undefined' ? new ResizeObserver(callback) : null;

const setupObservers = (separatorElementsIds: string[], calculateSeparatorOffset: () => void): (() => void) => {
  calculateSeparatorOffset();
  window?.addEventListener('resize', calculateSeparatorOffset);

  const resizeObserver = createResizeObserver(calculateSeparatorOffset);
  resizeObserver?.observe(document.body);

  separatorElementsIds.forEach(id => {
    const element = document.getElementById(id);
    element && resizeObserver?.observe(element);
  });

  return () => {
    window?.removeEventListener('resize', calculateSeparatorOffset);
    resizeObserver?.disconnect();
  };
};

const extractBackgroundColors = (
  background: BackgroundConfigItemElement | undefined | null,
  tenant: CmsTenant | null,
) => {
  if (!background) {
    return { topColor: null, baseColor: null };
  }

  const backgroundColorTop = background.backgroundColorTop?.value;
  const backgroundColorBase = background.backgroundColorBase?.value;

  const themeBackgroundColorTop = background.themeBackgroundColorTop
    ? parseBackgroundColor(tenant, background.themeBackgroundColorTop)
    : null;
  const themeBackgroundColorBase = background.themeBackgroundColorBase
    ? parseBackgroundColor(tenant, background.themeBackgroundColorBase)
    : null;

  return {
    topColor: backgroundColorTop || themeBackgroundColorTop,
    baseColor: backgroundColorBase || themeBackgroundColorBase,
  };
};

/**
 * Hook to manage page background configuration
 */
export const usePageBackground = (config: BackgroundConfigItem, tenant: CmsTenant | null) => {
  const [separatorOffset, setSeparatorOffset] = useState<number | string | undefined>(undefined);
  const background = config?.elements?.backgroundConfigItemElement?.values?.[0];
  const separatorElementsIds = parseSeparatorIds(background?.colorSeparatorId?.value);
  const { topColor, baseColor } = extractBackgroundColors(background, tenant);

  useEffect(() => {
    const calculateSeparatorOffset = () => setSeparatorOffset(findSeparatorElementMiddleOffset(separatorElementsIds));

    return setupObservers(separatorElementsIds, calculateSeparatorOffset);
  }, [separatorElementsIds.join(',')]);

  return {
    topColor,
    baseColor,
    topColorOffset: separatorOffset,
  };
};
