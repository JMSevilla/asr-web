import { Grid } from '@mui/material';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { SearchAddressParams } from '../../../api/mdp/types';
import { isTrue } from '../../../business/boolean';
import { findValueByKey } from '../../../business/find-in-array';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { PersonAddressForm } from './PersonAddressForm';
import { usePersonAddressLookup } from './hooks';
import { PersonAddressFormType } from './validation';

interface Props {
  id: string;
  pageKey: string;
  isStandAlone?: boolean;
  panelList?: PanelListItem[];
  journeyType: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}
export const PersonAddressBlock: React.FC<Props> = ({
  id,
  pageKey,
  parameters,
  isStandAlone,
  journeyType,
  panelList,
}) => {
  const { panelByKey } = usePanelBlock(panelList);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const personType = findValueByKey('person_type', parameters) ?? '';
  const optionalAddress = isTrue(findValueByKey('optional_address', parameters));
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const addressLookup = usePersonAddressLookup(journeyType);
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const stepData = useJourneyStepData<PersonAddressFormType>({
    pageKey,
    formKey: id,
    journeyType,
    personType,
    parseValuesToForm: valuesToForm,
  });

  const prefix = `${id}_${personType}`;
  const panel1 = panelByKey(`${prefix}_panel1`),
    panel2 = panelByKey(`${prefix}_panel2`);

  return (
    <Grid id={id} data-testid="person-address-form-block" container spacing={12}>
      {panel1 && (
        <Grid item xs={12}>
          {panel1}
        </Grid>
      )}
      <Grid item xs={12} lg={isStandAlone ? 12 : 6}>
        <PersonAddressForm
          prefix={prefix}
          defaultValues={stepData.values}
          onSubmit={handleSubmit}
          onAddressDetailsLookup={handleAddressDetailsLookup}
          onAddressSummaryLookup={handleAddressSummaryLookup}
          isOptional={optionalAddress}
        />
      </Grid>
      {panel2 && (
        <Grid item xs={12}>
          {panel2}
        </Grid>
      )}
    </Grid>
  );

  async function handleSubmit(values: PersonAddressFormType) {
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await stepData.save(values);
    await journeyNavigation.goNext();
  }

  async function handleAddressDetailsLookup(addressId: string) {
    const result = await addressLookup.loadDetails(addressId);
    return result?.data;
  }

  async function handleAddressSummaryLookup(params: SearchAddressParams) {
    const result = await addressLookup.loadSummary(params);
    return result?.data;
  }
};

function valuesToForm(values: PersonAddressFormType): PersonAddressFormType {
  const formValues: Partial<PersonAddressFormType> = { ...(values as PersonAddressFormType) };

  Object.keys(formValues).forEach(key => {
    const formKey = key as keyof PersonAddressFormType;

    if (formValues[formKey] === null) {
      delete formValues[formKey];
    }
  });

  return formValues as PersonAddressFormType;
}
