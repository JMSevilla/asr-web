import React, { createContext, useContext, useState } from 'react';
import { AcknowledgementsFormType } from '../../components/blocks/acknowledgementsForm/validation';

const context = createContext<{
  isSubmitting: boolean;
  acknowledgements?: AcknowledgementsFormType;
  onAcknowledgementsChanged(acknowledgements: AcknowledgementsFormType): void;
  toggleIsSubmitting(submitting: boolean): void;
}>(undefined as any);

export const useAcknowledgementsContext = () => {
  if (!context) {
    throw new Error('AcknowledgementsContextProvider should be used');
  }
  return useContext(context);
};

export const AcknowledgementsContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [acknowledgements, setAcknowledgements] = useState<AcknowledgementsFormType>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <context.Provider
      value={{
        acknowledgements,
        isSubmitting,
        onAcknowledgementsChanged: setAcknowledgements,
        toggleIsSubmitting: setIsSubmitting,
      }}
    >
      {children}
    </context.Provider>
  );
};
