import { ComponentProps } from 'react';
import { JourneyTypes } from '../../../../api/content/types/page';
import { DesignationOfFundsBlock } from '../../../../components';
import { useFundRows } from '../../../../components/blocks/funds/designationOfFunds/hooks';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useFormSubmissionBindingHooks } from '../../../../core/hooks/useFormSubmissionBindingHooks';
import { useJourneyNavigation } from '../../../../core/hooks/useJourneyNavigation';
import { useJourneyStepData } from '../../../../core/hooks/useJourneyStepData';
import { useSubmitJourneyStep } from '../../../../core/hooks/useSubmitJourneyStep';
import { act, render, screen } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../core/router', () => ({ useRouter: jest.fn() }));

jest.mock('../../../../core/contexts/FormSubmissionContext', () => ({
  useFormSubmissionContext: jest.fn().mockReturnValue({ hasCallback: jest.fn() }),
}));

jest.mock('../../../../core/hooks/useFormSubmissionBindingHooks', () => ({
  useFormSubmissionBindingHooks: jest.fn(),
}));

jest.mock('../../../../core/contexts/NotificationsContext', () => ({
  useNotificationsContext: jest.fn().mockReturnValue({ showNotifications: jest.fn(), hideNotifications: jest.fn() }),
}));

jest.mock('../../../../core/hooks/useJourneyNavigation', () => ({
  useJourneyNavigation: jest.fn().mockReturnValue({ goNext: jest.fn(), loading: false }),
}));

jest.mock('../../../../core/hooks/useJourneyStepData', () => ({
  useJourneyStepData: jest.fn().mockReturnValue({ save: jest.fn() }),
}));

jest.mock('../../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));

jest.mock('../../../../core/hooks/useSubmitJourneyStep', () => ({
  useSubmitJourneyStep: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
}));

jest.mock('../../../../components/blocks/funds/designationOfFunds/hooks', () => ({
  useFundRows: jest.fn().mockReturnValue({
    rows: [
      {
        fundCode: 'test',
        fundName: 'Test',
        fundGroup: 'Test group',
        factsheetUrl: 'https://test.com',
      },
    ],
    selected: [],
    update: jest.fn(),
  }),
}));

jest.mock('../../../../core/hooks/usePanelBlock', () => ({
  usePanelBlock: jest.fn().mockReturnValue({ panelByKey: jest.fn() }),
}));

const DEFAULT_PROPS: ComponentProps<typeof DesignationOfFundsBlock> = {
  id: 'test',
  pageKey: 'test',
  journeyType: JourneyTypes.RETIREMENT,
  panelList: [],
  parameters: [{ key: 'test', value: 'test' }],
};

describe('DesignationOfFundsBlock', () => {
  it('should render', async () => {
    await act(async () => {
      render(<DesignationOfFundsBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('funds-selection')).toBeInTheDocument();
  });

  it('should render funds modal', async () => {
    await act(async () => {
      render(<DesignationOfFundsBlock {...DEFAULT_PROPS} />);
    });
    await act(async () => {
      screen.getByTestId('funds-open-modal').click();
    });

    expect(screen.getByTestId('funds-modal')).toBeInTheDocument();
  });

  it('should render funds table', async () => {
    await act(async () => {
      render(<DesignationOfFundsBlock {...DEFAULT_PROPS} />);
    });
    expect(screen.getByTestId('funds-table')).toBeInTheDocument();
  });

  it('should render funds selection removed', async () => {
    const update = jest.fn();
    (useFundRows as jest.Mock).mockReturnValue({
      rows: [
        {
          fundCode: 'test',
          fundName: 'Test',
          fundGroup: 'Test group',
          factsheetUrl: 'https://test.com',
        },
      ],
      selected: [
        {
          fundCode: 'test',
          fundName: 'Test',
          fundGroup: 'Test group',
          factsheetUrl: 'https://test.com',
        },
      ],
      update,
    });
    await act(async () => {
      render(<DesignationOfFundsBlock {...DEFAULT_PROPS} />);
    });
    await act(async () => {
      screen.getByTestId('fund-test-delete').click();
    });
    expect(screen.getByTestId('funds-selection-removed')).toBeInTheDocument();
    expect(update).toHaveBeenCalled();
  });

  it('should hide removed fund message on funds update', async () => {
    const update = jest.fn();
    (useFundRows as jest.Mock).mockReturnValue({
      rows: [
        {
          fundCode: 'test',
          fundName: 'Test',
          fundGroup: 'Test group',
          factsheetUrl: 'https://test.com',
        },
      ],
      selected: [
        {
          fundCode: 'test',
          fundName: 'Test',
          fundGroup: 'Test group',
          factsheetUrl: 'https://test.com',
        },
      ],
      update,
    });
    await act(async () => {
      render(<DesignationOfFundsBlock {...DEFAULT_PROPS} />);
    });
    await act(async () => {
      screen.getByTestId('fund-test-delete').click();
    });
    await act(async () => {
      screen.getByTestId('funds-open-modal').click();
    });
    await act(async () => {
      screen.getByTestId('save-btn').click();
    });
    expect(screen.queryByTestId('funds-selection-removed')).not.toBeInTheDocument();
  });

  it('should submit step, save generic data and navigate next on submit', async () => {
    const execute = jest.fn();
    const save = jest.fn();
    const goNext = jest.fn();
    (useSubmitJourneyStep as jest.Mock).mockReturnValue({ execute, loading: false });
    (useJourneyStepData as jest.Mock).mockReturnValue({ save });
    (useJourneyNavigation as jest.Mock).mockReturnValue({ goNext, loading: false });
    (useFormSubmissionBindingHooks as jest.Mock).mockImplementation(({ cb }) => {
      cb();
    });
    await act(async () => {
      render(<DesignationOfFundsBlock {...DEFAULT_PROPS} />);
    });
    expect(execute).toHaveBeenCalled();
    expect(save).toHaveBeenCalled();
    expect(goNext).toHaveBeenCalled();
  });

  it('should render error', async () => {
    (useFundRows as jest.Mock).mockReturnValue({ error: true });
    const showNotifications = jest.fn();
    (useNotificationsContext as jest.Mock).mockReturnValue({ showNotifications, hideNotifications: jest.fn() });
    await act(async () => {
      render(<DesignationOfFundsBlock {...DEFAULT_PROPS} />, undefined, {
        messages: [{ elements: { messageKey: { value: 'test_error' }, type: {}, text: {} } } as any],
      });
    });
    expect(screen.getByTestId('funds-selection-error')).toBeInTheDocument();
    expect(showNotifications).toHaveBeenCalled();
  });
});
