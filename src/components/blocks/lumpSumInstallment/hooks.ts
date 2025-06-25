import { addDays, addYears } from 'date-fns';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { getUTCDate } from '../../../business/dates';
import { useApi } from '../../../core/hooks/useApi';
import { useLumpSumInstallmentState } from './reducer';
import { getDefaultDateFromMinMax } from './validation';

export interface GenericData {
  firstPaymentAmount: string;
  secondPaymentAmount: number;
  secondPaymentDate: string;
  firstPaymentString: string[];
  secondPaymentString: string[];
}

export const useLumpSumInstallment = (journeyType: JourneyTypeSelection, formKey: string) => {
  const { state, loadInitialData, setDateOfBirth, submitLumpSum } = useLumpSumInstallmentState();
  const { loading } = useApi(async api => {
    const data = await Promise.all([api.mdp.membershipData(), api.mdp.genericJourneyAllData(journeyType)]);
    const [membershipData, genericData] = data;

    if (membershipData?.data?.dateOfBirth) {
      setDateOfBirth(membershipData?.data?.dateOfBirth);
    }

    const totalLumpSum = formatLumpSum(genericData?.data);
    const firstPaymentAmount = Number((totalLumpSum / 2).toFixed(2));
    const retirementDate = findRetirementDate(genericData?.data);
    const minDate = addDays(getUTCDate(retirementDate), 1);
    const maxDate = addYears(getUTCDate(state?.dateOfBirth!), 75);
    const defaultSecondPaymentDate = findDefaultSecondPaymentDate(genericData?.data, formKey);

    loadInitialData({
      firstPaymentAmount: +firstPaymentAmount,
      totalLumpSum,
      retirementDate,
      secondPaymentDate: defaultSecondPaymentDate
        ? getUTCDate(defaultSecondPaymentDate)
        : getDefaultDateFromMinMax(retirementDate, minDate, maxDate),
    });

    return data;
  }, []);

  return {
    state,
    loading,
    submitLumpSum,
  };
};
function findDefaultSecondPaymentDate(data: any, key: string): Date | null {
  const date = data?.journey?.stepsWithData?.DC_lumpsum_installment?.[key]?.secondPaymentDate;

  return date ? getUTCDate(date) : null;
}

function findRetirementDate(data: any): Date {
  const date = data?.journey?.preJourneyData?.DC_options_filter_retirement_date?.retirementDate;

  return date ? getUTCDate(date) : new Date();
}

function formatLumpSum(data: any): number {
  const taxFreeLumpSum = data?.journey?.preJourneyData?.SelectedQuoteDetails?.cashLumpsum_taxFreeUFPLS ?? 0;
  const taxableLumpSum = data?.journey?.preJourneyData?.SelectedQuoteDetails?.cashLumpsum_taxableUFPLS ?? 0;

  return taxFreeLumpSum + taxableLumpSum;
}
