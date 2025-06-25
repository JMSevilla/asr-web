import { useFormSubmissionContext } from '../../../../core/contexts/FormSubmissionContext';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useApiCallback } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../../core/router';
import { MessageType } from '../../../topAlertMessages';
import { CustomActionHook } from '../types';

export const useSetInvestmentAnnuityQuoteAction: CustomActionHook = props => {
  const router = useRouter();
  const cachedAccessKey = useCachedAccessKey();
  const formSubmission = useFormSubmissionContext();
  const { buttonByKey, errorByKey } = useGlobalsContext();
  const { showNotifications } = useNotificationsContext();
  const message = errorByKey('LBG_API_error_banner');
  const errorButton = buttonByKey('LBG_API_error_banner_button');

  const investmentQuoteCb = useApiCallback(async api => {
    try {
      await api.mdp.investmentAnnuityQuote();
      if (props?.pageKey && props?.linkKey && props?.journeyType) {
        await api.mdp.genericJourneySubmitStep(props.journeyType, {
          currentPageKey: props.pageKey,
          nextPageKey: props.linkKey,
        });
      }
      await cachedAccessKey.refresh();
    } catch (e) {
      showNotifications([
        {
          type: MessageType.Problem,
          message,
          buttons: errorButton ? [errorButton] : undefined,
        },
      ]);
    }
  });

  return {
    execute: investmentQuoteCb.execute,
    disabled: !formSubmission.enabled,
    loading: router.loading || investmentQuoteCb.loading || cachedAccessKey.loading,
  };
};
