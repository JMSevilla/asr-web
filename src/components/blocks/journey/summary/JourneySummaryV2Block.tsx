import { Grid, Typography } from '@mui/material';
import { JourneyTypeSelection } from '../../../../api/content/types/page';
import { findValueByKey } from '../../../../business/find-in-array';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useApi } from '../../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../../core/hooks/useCachedAccessKey';
import { PersonFormType } from '../../personForm/validation';
import { RetirementOptionSummaryBlock } from '../../retirementOptionSummary/RetirementOptionSummaryBlock';
import { BankDetailsSummary } from './BankDetailsSummary';
import { PensionWiseGuidanceSummary } from './PensionWiseGuidanceSummary';
import { PersonalDetailsSummary } from './PersonalDetailsSummary';
import { SurrenderPensionSummary } from './SurrenderPensionSummary';
import { TaxDetailsSummary } from './TaxDetailsSummary';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
  pageKey: string;
  journeyType: JourneyTypeSelection;
}

export const JourneySummaryV2Block: React.FC<Props> = ({ id, parameters, pageKey, journeyType }) => {
  const accessKey = useCachedAccessKey();
  const changeTaxDataPageKey = findValueByKey('change_tax_page_key', parameters);
  const changePersonalDataPageKey = findValueByKey('change_personal_page_key', parameters);
  const changeSurrenderPensionWitnessPageKey = findValueByKey('change_surrender_pension_witness_page_key', parameters);
  const changeSurrenderPensionSpousePageKey = findValueByKey('change_surrender_pension_spouse_page_key', parameters);
  const changeBankPageKey = findValueByKey('change_bank_page_key', parameters);
  const changePensionWiseKey = findValueByKey('change_pension_wise_page_key', parameters);
  const retirementApplication = useApi(api => api.mdp.retirementApplication(accessKey.data!.contentAccessKey));
  const { labelByKey } = useGlobalsContext();

  const witnessData = parseFormValuesFromGenericData<PersonFormType>('person_data', 'sp_witness');
  const witnessName = [witnessData?.name, witnessData?.surname].filter(Boolean).join(' ');
  const spouseData = parseFormValuesFromGenericData<PersonFormType>('person_data', 'sp_spouse');
  const spouseName = [spouseData?.name, spouseData?.surname].filter(Boolean).join(' ');

  return (
    <Grid id={id} item container spacing={8} data-testid="journey-summary-block">
      <Grid item xs={12}>
        <Typography variant="body1" fontWeight="bold" mb={2}>
          {labelByKey('your_retirement_choice')}
        </Typography>
        <RetirementOptionSummaryBlock
          id="journey-summary-short"
          pageKey={pageKey}
          parameters={[{ key: 'postfix', value: '.short' }]}
        />
      </Grid>
      {retirementApplication.result?.data.hasAvcs && (
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight="bold" mb={2}>
            {labelByKey('pension-wise-guidance')}
          </Typography>
          <PensionWiseGuidanceSummary changePageKey={changePensionWiseKey!} journeyType={journeyType} />
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body1" fontWeight="bold" mb={2}>
          {labelByKey('tax')}
        </Typography>
        <TaxDetailsSummary changePageKey={changeTaxDataPageKey} pageKey={pageKey} />
      </Grid>
      {(witnessData || spouseData) && (
        <Grid item xs={12}>
          <Typography variant="body1" fontWeight="bold" mb={2}>
            {labelByKey('surrender_pension')}
          </Typography>
          <SurrenderPensionSummary
            journeyType={journeyType}
            changeWitnessPageKey={changeSurrenderPensionWitnessPageKey!}
            changeSpousePageKey={changeSurrenderPensionSpousePageKey!}
            witnessName={witnessName}
            spouseName={spouseName}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body1" fontWeight="bold" mb={2}>
          {labelByKey('personal_details')}
        </Typography>
        <PersonalDetailsSummary changePageKey={changePersonalDataPageKey!} />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" fontWeight="bold" mb={2}>
          {labelByKey('bank_details')}
        </Typography>
        <BankDetailsSummary changePageKey={changeBankPageKey} />
      </Grid>
    </Grid>
  );

  function parseFormValuesFromGenericData<T>(formKey: string, personType: string) {
    const form = retirementApplication?.result?.data.journeyGenericDataList?.find(
      d => d.formKey === [formKey, personType].join('_'),
    );
    return form?.genericDataJson ? (JSON.parse(form.genericDataJson) as T) : null;
  }
};
