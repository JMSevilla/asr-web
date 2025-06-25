import { ComponentProps } from 'react';
import { RetirementOptionsListBlock } from '../../../components';
import { useRetirementOptionsList } from '../../../components/blocks/retirementOptionsList/useRetirementOptionsList';
import { act, render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof RetirementOptionsListBlock> = {
  id: 'id',
  pageKey: 'key',
  journeyType: 'retirement',
  parameters: [{ key: 'isRootLevel', value: 'true' }],
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn(), parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApiCallback: jest.fn().mockReturnValue({ result: { data: null }, loading: false, execute: jest.fn() }),
  useApi: jest.fn().mockReturnValue({ result: { data: null }, loading: false }),
}));

jest.mock('../../../components/blocks/retirementOptionsList/useRetirementOptionsList', () => ({
  useRetirementOptionsList: jest.fn().mockReturnValue({
    list: [],
    transferDependantList: [],
    loading: false,
    transferDependantListLoading: false,
    optionNumberByKey: jest.fn(),
    valueByKey: jest.fn(),
    valueOfTransferByKey: jest.fn(),
  }),
}));

jest.mock('../../../cms/inject-tokens', () => ({
  useTokenEnrichedValue: (object: Object) => object,
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null, refresh: jest.fn() }),
}));

describe('RetirementOptionsListBlock', () => {
  it('should display list', () => {
    act(() => {
      render(<RetirementOptionsListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.queryByTestId('options-list')).toBeTruthy();
  });

  it('should display loader', () => {
    jest.mocked(useRetirementOptionsList).mockReturnValue({ loading: true } as any);
    act(() => {
      render(<RetirementOptionsListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.queryByTestId('options-loader')).toBeTruthy();
  });

  it('should display loader if failedCalcActionInProcess is true', () => {
    jest
      .mocked(useRetirementOptionsList)
      .mockReturnValue({ list: [], transferDependantList: [], loading: true, failedCalcActionInProcess: true } as any);
    act(() => {
      render(<RetirementOptionsListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.queryByTestId('options-loader')).toBeTruthy();
  });

  it('should not display loader if not loading and failedCalcActionInProcess is false', () => {
    jest.mocked(useRetirementOptionsList).mockReturnValue({
      list: [],
      transferDependantList: [],
      loading: false,
      failedCalcActionInProcess: false,
    } as any);
    act(() => {
      render(<RetirementOptionsListBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.queryByTestId('options-loader')).not.toBeInTheDocument();
  });
});
