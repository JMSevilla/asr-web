import { useEffect, useState } from 'react';
import { RetirementQuotesV3Option, UserRetirementApplicationStatus } from '../../../../api/mdp/types';
import { formatDate } from '../../../../business/dates';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';

export const useDateExplanationMessage = (
  userRAStatus?: Partial<UserRetirementApplicationStatus>,
  quotation?: RetirementQuotesV3Option['quotation'],
) => {
  const { labelByKey } = useGlobalsContext();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userRAStatus) return;

    const {
      earliestStartRaDateForSelectedDate: earliestDate,
      latestStartRaDateForSelectedDate: latestDate,
      retirementApplicationStatus,
      lifeStage,
    } = userRAStatus;

    const tokens = {
      earliest_start_ra_date_for_selected_retirement_date_label: earliestDate ? formatDate(earliestDate) : null,
      latest_start_ra_date_for_selected_retirement_date_label: latestDate ? formatDate(latestDate) : null,
      quote_expiry_date: (quotation?.guaranteed && quotation?.expiryDate && formatDate(quotation.expiryDate)) || null,
    };

    if (lifeStage === 'CloseToLatestRetirementAge') {
      setMessage(labelByKey('quote_list_date_explanation_over_max', tokens));
      return;
    }

    switch (retirementApplicationStatus) {
      case 'EligibleToStart':
        setMessage(labelByKey('quote_list_date_explanation_single', tokens));
        break;
      case 'NotEligibleToStart':
      case 'RetirementDateOutOfRange':
        setMessage(labelByKey('quote_list_date_explanation_range', tokens));
        break;
      case 'MinimumRetirementDateOutOfRange':
        setMessage(labelByKey('quote_list_date_protected_minimum_pension', tokens));
        break;
      default:
        setMessage(null);
        break;
    }
  }, [
    userRAStatus?.lifeStage,
    userRAStatus?.retirementApplicationStatus,
    userRAStatus?.earliestStartRaDateForSelectedDate,
    userRAStatus?.latestStartRaDateForSelectedDate,
    userRAStatus?.expirationRaDateForSelectedDate,
    quotation?.guaranteed,
    quotation?.expiryDate,
  ]);

  return message;
};
