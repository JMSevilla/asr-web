import { ComponentProps } from 'react';
import { DcRetirementLumpSumBlock } from '../../../components';
import { useApiCallback } from '../../../core/hooks/useApi';
import { render, screen, waitFor } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof DcRetirementLumpSumBlock> = {
  id: 'id',
  journeyType: 'bereavement',
  pageKey: 'pageKey',
  parameters: [],
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));


jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ bereavement: { form: { values: {}, resetPersonType: jest.fn() } } }),
}));

jest.mock('../../../core/hooks/useGenericStepData', () => ({
  useGenericStepData: jest.fn().mockReturnValue({ save: { execute: jest.fn() } }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
    parsedQuery: {
      type: 'quote',
    },
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: null }, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({
    result: { data: { quotes: null } },
    loading: false,
    execute: () => Promise.resolve({ result: { data: null } }),
  }),
}));

jest.mock('../../../cms/inject-tokens', () => ({
  useTokenEnrichedValue: (object: Object) => object,
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../core/contexts/retirement/RetirementContext', () => ({
  useRetirementContext: jest.fn().mockReturnValue({
    retirementCalculation: undefined,
    retirementCalculationLoading: false,
    transferOptions: undefined,
    transferOptionsLoading: false,
    quotesOptions: undefined,
    quotesOptionsError: undefined,
    quotesOptionsLoading: false,
  }),
}));

describe('DcRetirementLumpSumBlock', () => {
  it('should display summary', () => {
    render(<DcRetirementLumpSumBlock {...DEFAULT_PROPS} />);
    waitFor(() => expect(screen.queryByTestId('quotes-lump-sum-details-block')).toBeTruthy());
  });

  it('should display two loaders', () => {
    jest.mocked(useApiCallback).mockReturnValue({ result: { data: { quotes: null } }, loading: true } as any);
    render(<DcRetirementLumpSumBlock {...DEFAULT_PROPS} />);
    expect(screen.queryAllByTestId('two-column-loader').length).toBe(2);
  });

  it('should enable apply and recalculate buttons are disabled by default', async () => {
    jest.mocked(useApiCallback).mockReturnValue({ result: { data: { quotes: null } }, loading: false } as any);
    render(<DcRetirementLumpSumBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('recalculate-button')).toHaveClass('disabled');
  });
});
