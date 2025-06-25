import { useTransferLoaderState } from './useTransferLoaderState';

export const useTransferState = () => {
  const loader = useTransferLoaderState();

  return { loader };
};
