import { ComponentProps } from 'react';
import { LTAPercentageFormBlock } from '../../../components/blocks/ltaPercentageForm/LTAPercentageFormBlock';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { FormSubmissionParams, useFormSubmissionBindingHooks } from '../../../core/hooks/useFormSubmissionBindingHooks';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { useRouter } from '../../../core/router';
import { act, fireEvent, render, screen, waitFor } from '../../common';

const DEFAULT_PROPS: ComponentProps<typeof LTAPercentageFormBlock> = {
  id: 'id',
  journeyType: 'retirement',
  formKey: 'formKey',
  pageKey: 'pageKey',
  parameters: [
    { key: 'success_next_page', value: 'expectedNextPageKey' },
    { key: 'lta_exit_page', value: 'lta_exit_page' },
    { key: 'save_and_exit_button', value: 'save_and_exit_button' },
  ],
  isCloseButtonHidden: false,
};

jest.mock('../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ parseUrlAndPush: jest.fn() }),
}));

jest.mock('../../../core/hooks/useApi', () => ({
  useApi: jest.fn().mockReturnValue({
    result: { data: { percentage: 50 } },
    loading: false,
    error: false,
  }),
  useApiCallback: jest.fn().mockReturnValue({ loading: false, error: false }),
}));

jest.mock('../../../core/hooks/useCachedAccessKey', () => ({
  useCachedAccessKey: jest.fn().mockReturnValue({
    data: { schemeType: 'DB' },
    loading: false,
  }),
}));

jest.mock('../../../core/hooks/useFormSubmissionBindingHooks', () => ({ useFormSubmissionBindingHooks: jest.fn() }));

jest.mock('../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({
    values: { percentage: '50' },
    save: jest.fn(),
  }),
}));

jest.mock('../../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue(jest.fn()),
}));

jest.mock('../../../core/contexts/persistentAppState/PersistentAppStateContext', () => ({
  usePersistentAppState: jest
    .fn()
    .mockReturnValue({ fastForward: { shouldGoToSummary: jest.fn().mockReturnValue(false) } }),
}));

describe('LTAPercentageFormBlock', () => {
  it('renders the component correctly', () => {
    render(<LTAPercentageFormBlock {...DEFAULT_PROPS} />);
    expect(screen.getByTestId('lta-percentage-form')).toBeInTheDocument();
  });

  it('should call submit logic correctly', async () => {
    let submitFn: Function | null = null;
    const formSubmissionBind = (args: FormSubmissionParams) => (submitFn = args.cb);
    jest.mocked(useFormSubmissionBindingHooks).mockImplementation(formSubmissionBind);

    const navigateFn = jest.fn();
    const executeFn = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush: navigateFn } as any);
    jest.mocked(useApi).mockReturnValue({
      result: null,
      loading: false,
      error: false,
    } as any);
    jest.mocked(useSubmitJourneyStep).mockReturnValue({ execute: executeFn } as any);

    render(
      <LTAPercentageFormBlock
        {...DEFAULT_PROPS}
        parameters={[...DEFAULT_PROPS.parameters, { key: 'version', value: '2' }]}
      />,
    );
    await act(() => submitFn!());

    expect(executeFn).toHaveBeenCalledWith({ currentPageKey: 'pageKey', nextPageKey: 'expectedNextPageKey' });
    expect(navigateFn).toHaveBeenCalledWith('expectedNextPageKey');
  });

  it('handles form exit', async () => {
    const mockParseUrlAndPush = jest.fn();
    const mockExecute = jest.fn();
    jest.mocked(useRouter).mockReturnValue({ parseUrlAndPush: mockParseUrlAndPush } as any);
    jest.mocked(useSubmitJourneyStep).mockReturnValue({ execute: mockExecute } as any);
    render(<LTAPercentageFormBlock {...DEFAULT_PROPS} />);
    const continueButton = screen.getByTestId('exit');
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockExecute).toHaveBeenCalledWith({ currentPageKey: 'pageKey', nextPageKey: 'lta_exit_page' });
      expect(mockParseUrlAndPush).toHaveBeenCalledWith('lta_exit_page');
    });
  });

  it('should not render exit button when schemeType is DC', () => {
    jest.mocked(useCachedAccessKey).mockReturnValue({
      data: { schemeType: 'DC' },
    } as any);
    render(<LTAPercentageFormBlock {...DEFAULT_PROPS} />);
    expect(screen.queryByTestId('exit')).not.toBeInTheDocument();
  });
});
