import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from '../router';

interface CustomHeader {
  action?: (() => void) | null;
  title?: string | null;
  icon?: React.FC | null;
}

interface JourneyIndicatorContextValue {
  journeyInnerStep: number;
  journeyInnerStepsCount: number;
  customHeader: CustomHeader | null;
  setJourneyInnerStep(step: number): void;
  setJourneyInnerStepsCount(step: number): void;
  setCustomHeader(header: CustomHeader): void;
}

const JourneyIndicatorContext = createContext<JourneyIndicatorContextValue>({
  journeyInnerStep: 0,
  journeyInnerStepsCount: 0,
  customHeader: null,
  setJourneyInnerStep: () => null,
  setJourneyInnerStepsCount: () => null,
  setCustomHeader: () => null,
});

export const useJourneyIndicatorContext = () => useContext(JourneyIndicatorContext);

export const JourneyIndicatorContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const router = useRouter();
  const [journeyInnerStep, setJourneyInnerStep] = useState(0);
  const [journeyInnerStepsCount, setJourneyInnerStepsCount] = useState(0);
  const [customHeader, setCustomHeader] = useState<CustomHeader | null>(null);

  useEffect(() => setCustomHeader(null), [router.asPath]);

  return (
    <JourneyIndicatorContext.Provider
      value={{
        journeyInnerStep,
        journeyInnerStepsCount,
        customHeader,
        setJourneyInnerStep,
        setJourneyInnerStepsCount,
        setCustomHeader,
      }}
    >
      {children}
    </JourneyIndicatorContext.Provider>
  );
};
