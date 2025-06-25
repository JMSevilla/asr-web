import { ComponentProps } from 'react';
import { GBGScanFormBlock } from '../../../components';
import { useApi } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof GBGScanFormBlock> = {
  id: 'id',
  pageKey: 'key',
  tenant: null,
  parameters: [],
  journeyType: 'transfer2',
};

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({ useRouter: jest.fn().mockReturnValue({ loading: false }) }));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: { data: { accessToken: null } }, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({ result: { data: null }, loading: false, execute: jest.fn }),
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: { gbgId: 'id' },
  }),
}));

describe('GBGScanFormBlock', () => {
  it('should display iFrame', () => {
    render(<GBGScanFormBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('gbg-scan-form-block')).toBeTruthy();
    expect(screen.queryByTestId('gbg-scan-iframe')).toBeTruthy();
  });

  it('should display loader', () => {
    jest.mocked(useApi).mockReturnValueOnce({ loading: true } as any);
    render(<GBGScanFormBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('gbg-scan-form-loader')).toBeTruthy();
  });
});
