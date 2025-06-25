import { LocalizationProvider } from '@mui/lab';
import DateAdapter from '@mui/lab/AdapterDateFns';
import { ThemeProvider } from '@mui/material';
import { RenderOptions, render as rtlRender } from '@testing-library/react';
import rtlEvent from '@testing-library/user-event';
import { ReactElement } from 'react';
import { CmsGlobals } from '../api/content/types/globals';
import { GlobalsProvider } from '../core/contexts/GlobalsContext';
import { TenantContextProvider } from '../core/contexts/TenantContext';
import { theme } from '../core/theme/theme';

export * from '@testing-library/react';

export function noTranslation(t: string) {
  return t;
}

export function submittedResult() {
  return {
    loading: false,
    called: true,
  };
}

jest.mock('../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: { values: {} }, expiration: {} } }),
}));

export const render = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>, customGlobals?: CmsGlobals) =>
  rtlRender(ui, {
    wrapper: ({ children }) => (
      <TenantContextProvider tenant={null as any} authMethod={null as any}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <ThemeProvider theme={theme()}>
            <GlobalsProvider tenant={null} globals={customGlobals || null} preloadedGlobals={{}}>
              {children}
            </GlobalsProvider>
          </ThemeProvider>
        </LocalizationProvider>
      </TenantContextProvider>
    ),
    ...options,
  });

export const userEvent = rtlEvent;
