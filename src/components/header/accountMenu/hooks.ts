import { useEffect, useRef, useState } from 'react';

export const useContentScroller = (open: boolean) => {
  const ref = useRef<HTMLDivElement>(null);
  const [bottomReached, setBottomReached] = useState(false);

  useEffect(() => {
    if (open && ref.current) {
      const checkScrollStatus = () => {
        const element = ref.current;
        const isAtBottom =
          element!.scrollHeight <= element!.clientHeight ||
          element!.scrollTop + element!.clientHeight + 2 >= element!.scrollHeight;
        setBottomReached(isAtBottom);
      };

      checkScrollStatus();

      ref.current.addEventListener('scroll', checkScrollStatus);

      return () => {
        ref.current?.removeEventListener('scroll', checkScrollStatus);
      };
    }
  }, [open]);

  return { ref, bottomReached };
};
