import { SurrenderPensionSummary } from '../../../components/blocks/journey/summary/SurrenderPensionSummary';
import { useApi } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { act, render, screen } from '../../common';

jest.mock('../../../config', () => ({
  config: { value: jest.fn() },
}));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ loading: false }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({ result: null, loading: false }),
  useApiCallback: jest.fn().mockReturnValue({ loading: false }),
}));

describe('SurrenderPensionSummary', () => {
  it('should render correctly', () => {
    render(
      <SurrenderPensionSummary
        journeyType="retirement"
        changeWitnessPageKey="changeWitnessPageKey"
        changeSpousePageKey="changeSpousePageKey"
        witnessName="witnessName"
        spouseName="spouseName"
      />,
    );
    expect(screen.getByTestId('surrender-pension-summary')).toBeTruthy();
  });

  it('should render loader', () => {
    (useApi as jest.Mock).mockReturnValue({ result: null, loading: true });
    render(
      <SurrenderPensionSummary
        journeyType="retirement"
        changeWitnessPageKey="changeWitnessPageKey"
        changeSpousePageKey="changeSpousePageKey"
        witnessName="witnessName"
        spouseName="spouseName"
      />,
    );
    expect(screen.getByTestId('two-column-loader')).toBeTruthy();
  });

  it('should call router.parseUrlAndPush on change witness click', async () => {
    const parseUrlAndPush = jest.fn();
    (useApi as jest.Mock).mockReturnValue({ result: { spouseData: {}, checkboxes: {} } });
    (useRouter as jest.Mock).mockReturnValue({ parseUrlAndPush });
    render(
      <SurrenderPensionSummary
        journeyType="retirement"
        changeWitnessPageKey="changeWitnessPageKey"
        changeSpousePageKey="changeSpousePageKey"
        witnessName="witnessName"
        spouseName="spouseName"
      />,
      undefined,
      {
        buttons: [
          {
            elements: {
              buttonKey: { value: 'surrender_pension_change_witness_btn' },
              buttonText: { value: 'changeWitnessButton' },
            },
          },
        ] as any,
      },
    );

    await act(async () => {
      screen.getByTestId('change-surrender-pension-witness-button').click();
    });

    expect(parseUrlAndPush).toHaveBeenCalledWith('changeWitnessPageKey');
  });

  it('should call router.parseUrlAndPush on change spouse click', async () => {
    const parseUrlAndPush = jest.fn();
    (useApi as jest.Mock).mockReturnValue({ result: { spouseData: {}, checkboxes: {} } });
    (useRouter as jest.Mock).mockReturnValue({ parseUrlAndPush });
    render(
      <SurrenderPensionSummary
        journeyType="retirement"
        changeWitnessPageKey="changeWitnessPageKey"
        changeSpousePageKey="changeSpousePageKey"
        witnessName="witnessName"
        spouseName="spouseName"
      />,
      undefined,
      {
        buttons: [
          {
            elements: {
              buttonKey: { value: 'surrender_pension_change_spouse_btn' },
              buttonText: { value: 'changeSpouseButton' },
            },
          },
        ] as any,
      },
    );

    await act(async () => {
      screen.getByTestId('change-surrender-pension-spouse-button').click();
    });

    expect(parseUrlAndPush).toHaveBeenCalledWith('changeSpousePageKey');
  });
});
