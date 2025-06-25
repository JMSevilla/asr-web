import {
  useCloseDialogAction,
  useCreateQuoteAction,
  useDeleteJourneyAction,
  useDeleteRAAction,
  useDeleteTAAction,
  useDownloadGuaranteedTransferQuoteAction,
  useDownloadJourneyAction,
  useDownloadNewTAV2Action,
  useDownloadOptionsAction,
  useDownloadProtectedQuoteAction,
  useDownloadRAAction,
  useDownloadRetirementQuoteAction,
  useDownloadTAAction,
  useDownloadTAV2Action,
  useDownloadTemplateAction,
  useFormSavingAction,
  useFormSubmissionAction,
  useGuaranteedQuoteAction,
  useJourneyFormSubmissionAction,
  usePostIndexAction,
  useRetirementScenariosDialogAction,
  useSetInvestmentAnnuityQuoteAction,
  useStartDbCoreJourneyAction,
  useStartDcJourneyAction,
  useStartJourneyAction,
  useStartPreservedJourneyAction,
  useSubmitJourneyAction,
  useSubmitJourneyStepAction,
  useSubmitOnlyJourneyStepAction,
  useSubmitStartedTAAction,
} from '../../../../components/buttons/hooks/actions';
import { useCustomAction } from '../../../../components/buttons/hooks/useCustomAction';
import { useRouter } from '../../../../core/router';
import { act, renderHook } from '../../../common';

jest.mock('../../../../config', () => ({ config: { value: jest.fn() } }));

jest.mock('../../../../core/router', () => ({
  useRouter: jest.fn().mockReturnValue({ parseUrlAndPush: jest.fn(), loading: false, parsing: false }),
}));

jest.mock('../../../../components/buttons/hooks/actions', () => ({
  useDeleteRAAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadRAAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadTAAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useSubmitStartedTAAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useStartDcJourneyAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useStartDbCoreJourneyAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDeleteTAAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useFormSubmissionAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useJourneyFormSubmissionAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useCloseDialogAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadTAV2Action: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadNewTAV2Action: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadJourneyAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadTemplateAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  usePostIndexAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useFormSavingAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useStartJourneyAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useSubmitJourneyAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDeleteJourneyAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useStartPreservedJourneyAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useSubmitJourneyStepAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useSubmitOnlyJourneyStepAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useRetirementScenariosDialogAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useCreateQuoteAction: jest.fn().mockReturnValue((caseType: string) => ({ execute: jest.fn(), loading: false })),
  useDownloadOptionsAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadRetirementQuoteAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadGuaranteedTransferQuoteAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useGuaranteedQuoteAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useDownloadProtectedQuoteAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
  useSetInvestmentAnnuityQuoteAction: jest.fn().mockReturnValue({ execute: jest.fn(), loading: false }),
}));

describe('useCustomAction', () => {
  it('should not return anything if linkKey and actionKey are missing', () => {
    const { result } = renderHook(() => useCustomAction({}));
    expect(result.current).toEqual(undefined);
  });

  it('should not return anything if linkKey is missing and actionKey is incorrect', () => {
    const { result } = renderHook(() => useCustomAction({ actionKey: 'random-key' }));
    expect(result.current).toEqual(undefined);
  });

  it('should call parseUrlAndPush on execute if linkKey is present', async () => {
    const parseUrlAndPushFn = jest.fn();
    jest.mocked(useRouter).mockReturnValueOnce({ parseUrlAndPush: parseUrlAndPushFn } as any);
    const { result } = renderHook(() => useCustomAction({ linkKey: 'link-key', shouldNavigate: true }));
    await act(async () => {
      await result.current?.execute();
    });
    expect(parseUrlAndPushFn).toBeCalledTimes(1);
  });

  it('should call deleteRAAction on execute if actionKey is "delete-ra-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDeleteRAAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() => useCustomAction({ actionKey: 'delete-ra-action' }));
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });

  it('should call downloadRAAction on execute if actionKey is "download-ra-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadRAAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() => useCustomAction({ actionKey: 'download-ra-action' }));
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call downloadTAAction on execute if actionKey is "download-ta-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadTAAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() => useCustomAction({ actionKey: 'download-ta-action' }));
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call submitStartedTAAction on execute if actionKey is "submit-started-ta-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useSubmitStartedTAAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({ actionKey: 'submit-started-ta-action', linkKey: 'linkKey', pageKey: ' pageKey' }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });

  it('should call GuaranteedQuoteAction on execute if actionKey is "guaranteeing-quote-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useGuaranteedQuoteAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({ actionKey: 'guaranteeing-quote-action', linkKey: 'linkKey' }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });

  it('should call submitStartDCJourneyAction on execute if actionKey is "start-dc-journey-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useStartDcJourneyAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'start-dc-journey-action',
        linkKey: 'linkKey',
        pageKey: ' pageKey',
        journeyType: 'bereavement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call startDbCoreJourneyAction on execute if actionKey is "start-db-core-journey-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useStartDbCoreJourneyAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'start-db-core-journey-action',
        linkKey: 'linkKey',
        pageKey: ' pageKey',
        journeyType: 'retirement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call deleteTAAction on execute if actionKey is "delete-ta-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDeleteTAAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'delete-ta-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call formSubmissionAction on execute if actionKey is "form-submission-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useFormSubmissionAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'form-submission-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call journeyFormSubmissionAction on execute if actionKey is "journey-form-submission-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useJourneyFormSubmissionAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'journey-form-submission-action',
        linkKey: 'linkKey',
        pageKey: ' pageKey',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call closeDialogAction on execute if actionKey is "close-dialog-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useCloseDialogAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'close-dialog-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call downloadTAPdfAction on execute if actionKey is "download-ta-pdf-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadTAV2Action).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-ta-pdf-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call downloadTANewPdfAction on execute if actionKey is "download-ta-new-pdf-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadNewTAV2Action).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-ta-new-pdf-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call downloadJourneyPdfAction on execute if actionKey is "download-journey-pdf-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadJourneyAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-journey-pdf-action',
        journeyType: 'bereavement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call downloadJourneyTemplateAction on execute if actionKey is "download-journey-template-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadTemplateAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-journey-template-action',
        journeyType: 'bereavement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call postTAIndexAction on execute if actionKey is "post-ta-index-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(usePostIndexAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'post-ta-index-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call postBAIndexAction on execute if actionKey is "post-ba-index-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(usePostIndexAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'post-ba-index-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call formSavingAction on execute if actionKey is "form-saving-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useFormSavingAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'form-saving-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call startJourneyAction on execute if actionKey is "start-journey-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useStartJourneyAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'start-journey-action',
        pageKey: 'pageKey',
        journeyType: 'bereavement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call submitJourneyAction on execute if actionKey is "submit-journey-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useSubmitJourneyAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'submit-journey-action',
        journeyType: 'bereavement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call deleteJourneyAction on execute if actionKey is "delete-journey-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDeleteJourneyAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'delete-journey-action',
        journeyType: 'bereavement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call startPreserveJourneyAction on execute if actionKey is "start-preserved-journey-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useStartPreservedJourneyAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'start-preserved-journey-action',
        linkKey: 'linkKey',
        journeyType: 'bereavement',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call submitJourneyStepAction on execute if actionKey is "submit-journey-step-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useSubmitJourneyStepAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'submit-journey-step-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call submitOnlyJourneyStepAction on execute if actionKey is "submit-only-journey-step-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useSubmitOnlyJourneyStepAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'submit-only-journey-step-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call retirementScenariosDialogAction on execute if actionKey is "retirement-scenarios-dialog-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useRetirementScenariosDialogAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'retirement-scenarios-dialog-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call createQuoteTransferAction on execute if actionKey is "create-quote-transfer-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useCreateQuoteAction).mockReturnValueOnce(props => ({ execute: executeFn, loading: false }));
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'create-quote-transfer-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call createQuoteRetirementAction on execute if actionKey is "create-quote-retirement-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useCreateQuoteAction).mockReturnValueOnce(props => ({ execute: executeFn, loading: false }));
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'create-quote-retirement-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call downloadDCOptionListAction on execute if actionKey is "download-dc-option-list-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadOptionsAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-dc-option-list-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call downloadRetirementQuoteAction on execute if actionKey is "download-retirement-quote-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadRetirementQuoteAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-retirement-quote-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call useDownloadGuaranteedTransferQuoteAction on execute if actionKey is "download-guaranteed-transfer-quote-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadGuaranteedTransferQuoteAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-guaranteed-transfer-quote-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call useDownloadProtectedQuoteAction on execute if actionKey is "download-quote"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useDownloadProtectedQuoteAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'download-protected-quote-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
  it('should call useSetInvestmentAnnuityQuoteAction on execute if actionKey is "set-investment-annuity-quote-action"', async () => {
    const executeFn = jest.fn();
    jest.mocked(useSetInvestmentAnnuityQuoteAction).mockReturnValueOnce({ execute: executeFn, loading: false });
    const { result } = renderHook(() =>
      useCustomAction({
        actionKey: 'set-investment-annuity-quote-action',
      }),
    );
    await act(async () => {
      await result.current?.execute();
    });
    expect(executeFn).toBeCalledTimes(1);
  });
});
