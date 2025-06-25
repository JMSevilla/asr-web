import { BeneficiariesSummaryBlock } from '../../../components/blocks/beneficiariesSummary/';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { act, render, screen, userEvent } from '../../common';

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({ data: null }),
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    loading: false,
    asPath: '',
  }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: {
      data: {
        beneficiaries: [
          {
            address: {},
            id: 123,
            relationship: 'relationship',
            forenames: 'forenames',
            surname: 'surname',
            charityName: 'charityName',
            charityNumber: 123,
            lumpSumPercentage: 10,
            dateOfBirth: 'dateOfBirth',
            isPensionBeneficiary: false,
            notes: 'string',
          },
        ],
      },
    },
  }),
  useApiCallback: jest.fn().mockReturnValue({
    loading: false,
    error: undefined,
    result: { data: {} },
    execute: () => ({ data: { url: 'url' } }),
  }),
}));

describe('BeneficiariesSummaryBlock', () => {
  it('should render beneficiaries summary block', () => {
    render(<BeneficiariesSummaryBlock id="beneficiaries-block" parameters={[]} />);
    expect(screen.queryByTestId('beneficiaries-block')).toBeTruthy();
  });

  it('should download summary pdf', async () => {
    const execute = jest.fn();
    jest.mocked(useApiCallback).mockReturnValue({ execute } as any);
    render(<BeneficiariesSummaryBlock id="beneficiaries-block" parameters={[]} />);

    await act(async () => {
      await userEvent.click(screen.getByTestId('download-beneficiaries-btn'));
    });

    expect(execute).toBeCalled();
  });
  it('should redirect to update page', async () => {
    const parseUrlAndPush = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush } as any);
    render(
      <BeneficiariesSummaryBlock
        id="beneficiaries-block"
        parameters={[{ key: 'update_beneficiaries_summary_page', value: 'url' }]}
      />,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('update-beneficiaries-btn'));
    });

    expect(parseUrlAndPush).toBeCalled();
    expect(parseUrlAndPush).toBeCalledWith('url');
  });
});
