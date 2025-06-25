import { createContext, useContext } from 'react';
import { useBereavementState } from './hooks/bereavement';
import { useCheckboxState } from './hooks/checkbox';
import { useTransferState } from './hooks/transfer';
import { useFastForward } from './hooks/useFastForward';

interface Props {}

export interface PersistentAppState {
  bereavement: ReturnType<typeof useBereavementState>;
  transfer: ReturnType<typeof useTransferState>;
  checkbox: ReturnType<typeof useCheckboxState>;
  fastForward: ReturnType<typeof useFastForward>;
}

const context = createContext<PersistentAppState>(undefined as any);

export const PersistentAppStateProvider: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const bereavement = useBereavementState();
  const transfer = useTransferState();
  const checkbox = useCheckboxState();
  const fastForward = useFastForward();

  return <context.Provider value={{ bereavement, transfer, checkbox, fastForward }}>{children}</context.Provider>;
};

export const usePersistentAppState = () => {
  if (!context) {
    throw new Error('PersistentAppStateProvider should be used');
  }
  return useContext(context);
};
