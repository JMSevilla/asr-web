import React, { createContext, useContext, useState } from 'react';

interface TransferCalculations {
  requestedTransferValue?: number;
  requestedResidualPension?: number;
}

const context = createContext<{
  isSubmitting: boolean;
  transferCalculations?: TransferCalculations;
  onTransferCalculationChanged(calculations: TransferCalculations): void;
  toggleIsSubmitting(submitting: boolean): void;
}>(undefined as any);

export const useTransferJourneyContext = () => {
  if (!context) {
    throw new Error('TransferJourneyContextProvider should be used');
  }
  return useContext(context);
};

export const TransferJourneyContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [transferCalculations, setTransferCalculations] = useState<TransferCalculations>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <context.Provider
      value={{
        transferCalculations,
        isSubmitting,
        onTransferCalculationChanged: setTransferCalculations,
        toggleIsSubmitting: setIsSubmitting,
      }}
    >
      {children}
    </context.Provider>
  );
};
