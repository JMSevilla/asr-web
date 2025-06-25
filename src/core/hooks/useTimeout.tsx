import { useEffect, useRef } from 'react';

export function useTimeout(callback: Function, delay: number | null): React.MutableRefObject<number | null> {
  const timeoutRef = useRef<number | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (typeof delay === 'number' && window !== undefined) {
      timeoutRef.current = window.setTimeout(() => callbackRef.current(), delay);

      return () => window.clearTimeout(timeoutRef.current || 0);
    }
  }, [delay]);

  return timeoutRef;
}
