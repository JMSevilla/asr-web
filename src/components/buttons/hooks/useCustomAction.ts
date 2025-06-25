import { JourneyTypeSelection } from '../../../api/content/types/page';
import { useRouter } from '../../../core/router';
import {
  useAuthLoginAction,
  useAuthLogoutAction,
  useAuthRegisterAction,
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
  useSelectLinkedRecordAction,
  useSetInvestmentAnnuityQuoteAction,
  useSetSelectedRetirementDateAction,
  useStartDbCoreJourneyAction,
  useStartDcJourneyAction,
  useStartJourneyAction,
  useStartPreservedJourneyAction,
  useSubmitJourneyAction,
  useSubmitJourneyStepAction,
  useSubmitOnlyJourneyStepAction,
  useSubmitStartedTAAction,
} from './actions';
import { CustomActionHook } from './types';

interface Props {
  journeyType?: JourneyTypeSelection;
  actionKey?: string;
  linkKey?: string;
  pageKey?: string;
  shouldNavigate?: boolean;
  params?: string;
}

/**
 * Enables the execution of custom actions directly from CMS button via customActionKey property.
 * @param journeyType Journey type (from button or from page)
 * @param actionKey Action key
 * @param pageKey Page key (for action request payload)
 * @param linkKey Link key (for navigation from action)
 * @param shouldNavigate Should navigate (for navigation from action)
 * @param params Action parameters (for custom parameters passing to action)
 * @example
 * const action = useCustomAction({
      actionKey: customActionKey,
      linkKey,
      pageKey,
      journeyType,
      shouldNavigate: !onClick,
      params: 'custom-params',
    });
    const { 
      execute, // function to execute the action
      loading, // boolean to indicate if the action is loading
      disabled, // boolean to indicate if the action is disabled
      disableFurtherActions, // function to disable further actions after custom action call
      node // JSX element that can be used for rendering (useful for actions with modals)
    } = action;
 */
export const useCustomAction = ({
  journeyType,
  actionKey,
  linkKey,
  pageKey,
  shouldNavigate,
  params,
}: Props): ReturnType<CustomActionHook> | undefined => {
  const [actionName, actionParam] = actionKey?.split(':') || [];

  switch (actionName) {
    case 'delete-ra-action':
      return useDeleteRAAction();
    case 'download-ra-action':
      return useDownloadRAAction();
    case 'download-ta-action':
      return useDownloadTAAction();
    case 'submit-started-ta-action':
      return useSubmitStartedTAAction({ linkKey, pageKey });
    case 'start-dc-journey-action':
      return useStartDcJourneyAction({ journeyType, linkKey, pageKey });
    case 'delete-ta-action':
      return useDeleteTAAction();
    case 'form-submission-action':
      return useFormSubmissionAction();
    case 'journey-form-submission-action':
      return useJourneyFormSubmissionAction({ linkKey, pageKey });
    case 'close-dialog-action':
      return useCloseDialogAction();
    case 'download-ta-pdf-action':
      return useDownloadTAV2Action();
    case 'download-ta-new-pdf-action':
      return useDownloadNewTAV2Action();
    case 'download-journey-pdf-action':
      return useDownloadJourneyAction({ journeyType });
    case 'download-journey-template-action':
      return useDownloadTemplateAction({ journeyType, actionParam });
    case 'post-ta-index-action':
      return usePostIndexAction({ journeyType: 'transfer2' });
    case 'post-ba-index-action':
      return usePostIndexAction({ journeyType: 'bereavement' });
    case 'post-ra-index-action':
      return usePostIndexAction({ journeyType: 'retirement' });
    case 'form-saving-action':
      return useFormSavingAction();
    case 'start-journey-action':
      return useStartJourneyAction({ linkKey, pageKey, journeyType });
    case 'submit-journey-action':
      return useSubmitJourneyAction({ linkKey, journeyType });
    case 'delete-journey-action':
      return useDeleteJourneyAction({ linkKey, journeyType });
    case 'start-preserved-journey-action':
      return useStartPreservedJourneyAction({ linkKey, pageKey, journeyType });
    case 'submit-journey-step-action':
      return useSubmitJourneyStepAction({ linkKey, pageKey, journeyType, actionParam });
    case 'submit-only-journey-step-action':
      return useSubmitOnlyJourneyStepAction({ linkKey, pageKey, journeyType });
    case 'retirement-scenarios-dialog-action':
      return useRetirementScenariosDialogAction();
    case 'create-quote-transfer-action':
      return useCreateQuoteAction('transfer')({ linkKey, pageKey, journeyType });
    case 'create-quote-retirement-action':
      return useCreateQuoteAction('retirement')({ linkKey, pageKey, journeyType });
    case 'download-dc-option-list-action':
      return useDownloadOptionsAction();
    case 'download-retirement-quote-action':
      return useDownloadRetirementQuoteAction();
    case 'download-guaranteed-transfer-quote-action':
      return useDownloadGuaranteedTransferQuoteAction();
    case 'start-db-core-journey-action':
      return useStartDbCoreJourneyAction({ linkKey, pageKey, journeyType });
    case 'login-action':
      return useAuthLoginAction();
    case 'register-action':
      return useAuthRegisterAction();
    case 'logout-action':
      return useAuthLogoutAction();
    case 'sa-select-linked-record-action':
      return useSelectLinkedRecordAction();
    case 'guaranteeing-quote-action':
      return useGuaranteedQuoteAction({ linkKey });
    case 'set-selected-retirement-date-action':
      return useSetSelectedRetirementDateAction({ linkKey, params });
    case 'download-protected-quote-action':
      return useDownloadProtectedQuoteAction({ linkKey, params });
    case 'set-investment-annuity-quote-action':
      return useSetInvestmentAnnuityQuoteAction({ linkKey, pageKey, journeyType });
    default:
      break;
  }

  if (shouldNavigate && linkKey) {
    const router = useRouter();
    return { execute: () => router.parseUrlAndPush(linkKey), loading: router.parsing || router.loading };
  }

  return undefined;
};
