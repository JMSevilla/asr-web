import { useEffect, useState } from 'react';

export const useEmbeddedVideoHeight = (recalculateOnResize: boolean): [(ref: HTMLDivElement) => void, number] => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [videoHeight, setVideoHeight] = useState<number>(ref ? ref.clientWidth * 0.5 : 0);

  useEffect(() => {
    if (recalculateOnResize && ref) {
      const handleResize = () => setVideoHeight(ref.clientWidth * 0.5);
      handleResize();
      window.addEventListener('resize', handleResize);
      ref.children.item(0)?.addEventListener('load', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        ref.children.item(0)?.removeEventListener('load', handleResize);
      };
    }
  }, [ref, recalculateOnResize]);

  return [setRef, videoHeight || (ref?.clientWidth ?? 0) * 0.5];
};
