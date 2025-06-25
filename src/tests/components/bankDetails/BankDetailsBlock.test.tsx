import React from 'react';
import { BankDetailsBlock } from '../../../components';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { render, screen } from '../../common';

const PARAMETERS = [
  { key: 'success_next_page', value: 'success_next_page' },
  { key: 'hide_save_and_close', value: 'true' },
  { key: 'on_close_page', value: 'on_close_page' },
  { key: 'hide_save_and_close', value: 'true' },
  { key: 'save_and_exit_button', value: 'save_and_exit_button' },
];

const BANK_DETAILS = {
  accountNumber: 'string',
  bankName: 'string',
  branchName: 'string',
  city: 'string',
  country: 'string',
  countryCode: 'string',
  name: 'string',
  postCode: 'string',
  sortCode: 'string',
  streetAddress: 'string',
};

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest.fn().mockReturnValue({ bereavement: { form: {}, expiration: {}, fastForward: {} } }),
}));

jest.mock('../../../config', () => ({
  getConfig: jest.fn().mockReturnValue({ publicRuntimeConfig: { processEnv: {} } }),
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));

jest.mock('../../../core/contexts/auth/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: false,
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    result: {
      data: {},
    },
    error: false,
  }),
  useApiCallback: jest.fn(),
}));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: {},
  }),
}));

jest.mock('../../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue(jest.fn()),
}));

describe('BankDetailsBlock', () => {
  it('should render bank details form by default', () => {
    jest.mocked(useApi).mockReturnValue({
      result: {
        data: [],
      },
    } as any);
    jest.mocked(useApiCallback).mockReturnValue({
      loading: false,
      result: {
        data: {},
      },
      error: undefined,
    } as any);

    render(<BankDetailsBlock id="block" parameters={PARAMETERS} journeyType="retirement" pageKey={'page_key'} />);
    const bankForm = screen.queryByTestId('bank_form');
    expect(bankForm).toBeTruthy();
  });
  it('should render correct buttons', () => {
    render(
      <BankDetailsBlock id="block" parameters={PARAMETERS} journeyType="retirement" pageKey={'page_key'} />,
      undefined,
      {
        buttons: [
          { elements: { buttonKey: { value: 'content-button-block' } }, type: 'button' },
          { elements: { buttonKey: { value: 'close_app_save_and_exit' } }, type: 'button' },
        ],
      },
    );
    expect(screen.getByTestId('content-button-block')).toBeInTheDocument();
    expect(screen.queryByTestId('close_app_save_and_exit')).not.toBeInTheDocument();
  });
  it('should render bank details list if submitted', () => {
    jest
      .spyOn(React, 'useState')
      .mockReturnValue([true, () => {}])
      .mockReturnValue([BANK_DETAILS, () => {}]);
    render(<BankDetailsBlock id="block" parameters={PARAMETERS} journeyType="retirement" pageKey={'page_key'} />);

    const bankDetailsList = screen.queryByTestId('bank_details_list');

    expect(bankDetailsList).toBeTruthy();
  });
});
