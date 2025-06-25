import { Box, Stack } from '@mui/material';
import { addDays, addYears } from 'date-fns';
import { useEffect } from 'react';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { currencyValue } from '../../../business/currency';
import { formatDate, getUTCDate, normalizeDate } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { DetailsContainer } from '../../DetailsContainer';
import { SummaryDetailsRow } from '../../SummaryDetailsRow';
import { ListLoader } from '../../loaders';
import { LumpSumInstallmentForm } from './LumpSumInstallmentForm';
import { GenericData, useLumpSumInstallment } from './hooks';
import { ChangeLumpSumForm, getDefaultDateFromMinMax } from './validation';

interface Props {
  id: string;
  journeyType: JourneyTypeSelection;
  pageKey: string;
}

const MAX_LUMP_SUM_MULTIPLIER = 0.95;

export const LumpSumInstallmentBlock: React.FC<Props> = ({ id, journeyType, pageKey }) => {
  const { labelByKey } = useGlobalsContext();
  const genericData = useJourneyStepData<GenericData>({
    pageKey,
    formKey: id,
    journeyType,
    personType: 'lump_sum_installment',
  });
  const { state, loading, submitLumpSum } = useLumpSumInstallment(journeyType, `${id}_lump_sum_installment`);
  const { firstPaymentAmount, secondPaymentAmount, totalLumpSum, secondPaymentDate, retirementDate } = state;
  const minDate = addDays(getUTCDate(retirementDate), 1);
  const maxDate = addYears(getUTCDate(state?.dateOfBirth!), 75);

  useEffect(() => {
    if (!genericData.values) return;
    const { firstPaymentAmount, secondPaymentAmount, secondPaymentDate } = genericData.values;

    if (firstPaymentAmount && secondPaymentDate) {
      submitLumpSum({
        firstPaymentAmount: +firstPaymentAmount,
        secondPaymentAmount: +secondPaymentAmount,
        secondPaymentDate: secondPaymentDate
          ? getUTCDate(secondPaymentDate)
          : getDefaultDateFromMinMax(retirementDate, minDate, maxDate),
      });
    }
  }, [genericData.values?.firstPaymentAmount, genericData.values?.secondPaymentDate]);

  if (loading) return <ListLoader id={id} loadersCount={2} data-testid={`${id}_loader`} />;

  return (
    <Stack gap={12} flexDirection="column" flexWrap="nowrap" data-testid={id}>
      <LumpSumInstallmentForm
        prefix={id}
        totalLumpSum={totalLumpSum}
        maxLumpSum={totalLumpSum * MAX_LUMP_SUM_MULTIPLIER}
        retirementDate={retirementDate!}
        onSubmit={onSubmit}
        defaultFirstPaymentAmount={genericData.values?.firstPaymentAmount}
        defaultSecondPaymentDate={genericData.values?.secondPaymentDate}
        loading={genericData.loading}
        minDate={minDate}
        maxDate={maxDate}
      />
      <Box>
        <DetailsContainer>
          <SummaryDetailsRow
            id={`${id}_1`}
            label={labelByKey(`${id}_first_payment`)}
            value={[
              `${labelByKey('currency:GBP')}${currencyValue(firstPaymentAmount)} ${labelByKey(
                'lump_sum_installment_middle_text',
              )}`,
              formatDate(retirementDate),
            ]}
            textVariant="h3"
            textSx={{ display: 'flex', justifyContent: 'flex-end' }}
          />
          <SummaryDetailsRow
            id={`${id}_2`}
            label={labelByKey(`${id}_second_payment`)}
            value={[
              `${labelByKey('currency:GBP')}${currencyValue(secondPaymentAmount)} ${labelByKey(
                'lump_sum_installment_middle_text',
              )}`,
              formatDate(normalizeDate(secondPaymentDate)),
            ]}
            textVariant="h3"
            textSx={{ display: 'flex', justifyContent: 'flex-end' }}
          />
        </DetailsContainer>
      </Box>
    </Stack>
  );

  async function onSubmit(values: ChangeLumpSumForm) {
    const secondPaymentAmount = totalLumpSum - values.firstPaymentAmount;
    const secondPaymentDateISO = normalizeDate(new Date(values.secondPaymentDate)).toISOString();
    const firstPaymentString = [
      `${labelByKey('currency:GBP')}${currencyValue(values.firstPaymentAmount)} ${labelByKey(
        'lump_sum_installment_middle_text',
      )}`,
      formatDate(retirementDate),
    ];
    const secondPaymentString = [
      `${labelByKey('currency:GBP')}${currencyValue(secondPaymentAmount)} ${labelByKey(
        'lump_sum_installment_middle_text',
      )}`,
      formatDate(normalizeDate(values.secondPaymentDate)),
    ];

    submitLumpSum({
      firstPaymentAmount: +values.firstPaymentAmount,
      secondPaymentDate: getUTCDate(values.secondPaymentDate),
      secondPaymentAmount,
    });

    await genericData.save({
      firstPaymentAmount: (+values.firstPaymentAmount).toFixed(2),
      secondPaymentAmount,
      secondPaymentDate: secondPaymentDateISO,
      firstPaymentString,
      secondPaymentString,
    });
  }
};
