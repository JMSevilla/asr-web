import { cloneElement, useCallback, useEffect, useRef, useState } from 'react';

export const useVisibleItemsLimiter = (items: React.ReactElement[], maxHeight: number, moreLabelHeight: number) => {
  const ref = useRef<HTMLTableSectionElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [itemsCount, setItemsCount] = useState<number | null>(0);
  const [finalCount, setFinalCount] = useState<number | null>(null);

  const updateVisibleItems = useCallback(() => {
    if (!ref.current || !items.length || itemsCount === null) return;

    if (itemsCount >= items.length) {
      setItemsCount(null);
      setFinalCount(null);
      return;
    }

    const isLastItem = itemsCount === items.length - 1;
    const maxHeightExceeded = ref.current.offsetHeight + (isLastItem ? 0 : moreLabelHeight) > maxHeight;
    if (maxHeightExceeded) {
      setItemsCount(null);
      setFinalCount(itemsCount);
      return;
    }

    setItemsCount(itemsCount + 1);
  }, [items, itemsCount, moreLabelHeight, maxHeight]);

  useEffect(() => {
    updateVisibleItems();
  }, [updateVisibleItems]);

  useEffect(() => {
    const resetVisibleItems = () => {
      debounceTimeout.current && clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        setItemsCount(0);
        setFinalCount(null);
      }, 100);
    };
    window.addEventListener('resize', resetVisibleItems);
    return () => window.removeEventListener('resize', resetVisibleItems);
  }, []);

  const shouldCheckNextItem = itemsCount !== null && !!items[itemsCount] && !finalCount;

  return {
    tBodyRef: ref,
    visibleItemsCount: finalCount,
    visibleItems: [
      ...items.slice(0, itemsCount ?? finalCount ?? items.length),
      shouldCheckNextItem && cloneElement(items[itemsCount], { temporary: true }),
    ].filter(Boolean),
  };
};
