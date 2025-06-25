import { Grid } from '@mui/material';
import { JourneyTypeSelection, PanelListItem } from '../../../api/content/types/page';
import { isTrue } from '../../../business/boolean';
import { toLocalISOString } from '../../../business/dates';
import { findValueByKey } from '../../../business/find-in-array';
import { countryFromPhoneCode, phoneCodeFromCountry } from '../../../business/phone';
import { useJourneyNavigation } from '../../../core/hooks/useJourneyNavigation';
import { useJourneyStepData } from '../../../core/hooks/useJourneyStepData';
import { usePanelBlock } from '../../../core/hooks/usePanelBlock';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { PersonForm } from './PersonForm';
import { PersonFormType } from './validation';

interface Props {
  id: string;
  pageKey: string;
  isStandAlone?: boolean;
  panelList?: PanelListItem[];
  journeyType: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

interface PersonStepDataType extends PersonFormType {
  formattedPhone?: string;
}

export const PersonFormBlock: React.FC<Props> = ({ id, pageKey, panelList, journeyType, isStandAlone, parameters }) => {
  const personType = findValueByKey('person_type', parameters) ?? '';
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const isFullWidth = isTrue(findValueByKey('is_full_width', parameters));
  const displayedFields = findValueByKey('show_fields', parameters)?.split(';') ?? [];
  const maxCharacters = findValueByKey('max_characters', parameters) ?? '';
  const { panelByKey } = usePanelBlock(panelList);
  const submitStepCb = useSubmitJourneyStep(journeyType);
  const journeyNavigation = useJourneyNavigation(journeyType, nextPageKey);
  const stepData = useJourneyStepData<PersonStepDataType>({
    pageKey,
    formKey: id,
    journeyType,
    personType,
    parseFormToValues: formToValues,
    parseValuesToForm: valuesToForm,
  });

  const prefix = `${id}_${personType}`;
  const panel1 = panelByKey(`${prefix}_panel_1`);
  const panel2 = panelByKey(`${prefix}_panel_2`);

  return (
    <Grid container spacing={12} id={id}>
      {panel1 && (
        <Grid item xs={12}>
          {panel1}
        </Grid>
      )}
      <Grid item xs={12} lg={isStandAlone || isFullWidth ? 12 : 6}>
        <PersonForm
          prefix={prefix}
          onSubmit={handleSubmit}
          fields={displayedFields}
          defaultValues={stepData.values}
          isFullWidth={isFullWidth}
          maxCharacters={maxCharacters}
        />
      </Grid>
      {panel2 && (
        <Grid item xs={12}>
          {panel2}
        </Grid>
      )}
    </Grid>
  );

  async function handleSubmit(values: PersonFormType) {
    const formattedPhone = values?.phoneNumber
      ? `${phoneCodeFromCountry(values.phoneCode)} ${values.phoneNumber}`
      : undefined;
    await submitStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    await stepData.save({ ...values, formattedPhone });
    await journeyNavigation.goNext();
  }
};

function valuesToForm(values: PersonFormType): PersonFormType {
  const formValues: Partial<PersonFormType> = { ...(values as PersonFormType) };

  values.phoneCode && Object.assign(formValues, { phoneCode: countryFromPhoneCode(values.phoneCode) });
  values.dateOfBirth && Object.assign(formValues, { dateOfBirth: new Date(values.dateOfBirth) });
  values.dateOfDeath && Object.assign(formValues, { dateOfDeath: new Date(values.dateOfDeath) });

  Object.keys(formValues).forEach(key => {
    const formKey = key as keyof PersonFormType;

    if (formValues[formKey] === null) {
      delete formValues[formKey];
    }
  });

  return formValues as PersonFormType;
}

function formToValues(values: PersonFormType): PersonFormType {
  return {
    ...values,
    dateOfBirth: toLocalISOString(values.dateOfBirth),
    dateOfDeath: toLocalISOString(values.dateOfDeath),
    phoneCode: values.phoneNumber ? phoneCodeFromCountry(values.phoneCode).replace('+', '') : undefined,
    phoneNumber: values.phoneNumber ? values.phoneNumber : undefined,
  } as unknown as PersonFormType;
}
