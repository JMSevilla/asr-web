import { Grid } from '@mui/material';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useRouter } from '../../../core/router';
import { Button } from '../../buttons';
import { BereavementSummaryDetails } from './BereavementSummaryDetails';
import { useBereavementSummaryDetailsValues } from './hooks';

interface Props {
  id: string;
  pageKey: string;
  parameters: { key: string; value: string }[];
}

export const BereavementSummaryBlockV2: React.FC<Props> = ({ id, parameters }) => {
  const router = useRouter();
  const { labelByKey, buttonByKey, classifierByKey } = useGlobalsContext();
  const { bereavement } = usePersistentAppState();
  const relationshipOptions = classifierByKey('bereavement_relationships');
  const summaryValues = useBereavementSummaryDetailsValues(prefixedLabel, parameters, relationshipOptions);
  const changeDeceasedDetailsButton = buttonByKey('bereav_confirm_det_deceased_change');
  const changeReporterDetailsButton = buttonByKey('bereav_confirm_det_reporter_change');
  const changeNextOfKinDetailsButton = buttonByKey('bereav_confirm_det_nextOfKin_change');
  const changeNextOfKinSelectionButton = buttonByKey('bereav_confirm_det_nextOfKin_selection_change');
  const changeExecutorDetailsButton = buttonByKey('bereav_confirm_det_executor_change');
  const changeExecutorSelectionButton = buttonByKey('bereav_confirm_det_executor_selection_change');
  const changeContactPersonDetailsButton = buttonByKey('bereav_confirm_det_contactPerson_change');
  const changeContactPersonSelectionButton = buttonByKey('bereav_confirm_det_contactPerson_selection_change');
  const changeDocumentsDetailsButton = buttonByKey('bereav_confirm_documents_change');

  return (
    <Grid container id={id} spacing={12}>
      <Grid item xs={12}>
        <BereavementSummaryDetails
          loading={summaryValues.loading}
          actionButton={
            <Button
              {...changeDeceasedDetailsButton}
              onClick={() => handleChangeButtonClick(changeDeceasedDetailsButton?.linkKey)}
            />
          }
          prefixedLabel={prefixedLabel}
          parsedValue={summaryValues.parseValue}
          personType="deceased"
          fields={[
            { key: 'name', value: 'name' },
            { key: 'surname', value: 'surname' },
            { key: 'date_of_birth', value: 'dateOfBirth' },
            { key: 'address', value: 'address' },
            { key: 'date_of_death', value: 'dateOfDeath' },
            { key: 'marital', value: 'maritalStatus' },
            { key: 'cohabiting', value: 'cohabitantsStatus' },
            { key: 'children', value: 'dependantsStatus' },
            { key: 'national_insurance_no', value: 'identification.nationalInsuranceNumber' },
            { key: 'public_service_no', value: 'identification.personalPublicServiceNumber' },
            { key: 'pension_references', value: 'identification.pensionReferenceNumbers' },
          ]}
        />
      </Grid>
      {bereavement.form.values['reporter'] && (
        <Grid item xs={12}>
          <BereavementSummaryDetails
            actionButton={
              <Button
                {...changeReporterDetailsButton}
                onClick={() => handleChangeButtonClick(changeReporterDetailsButton?.linkKey)}
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="reporter"
            fields={[
              { key: 'name', value: 'name' },
              { key: 'surname', value: 'surname' },
              { key: 'relationship', value: 'relationship' },
              { key: 'address', value: 'address' },
              { key: 'phone', value: 'phoneNumber' },
              { key: 'email', value: 'email', disabled: true },
            ]}
          />
        </Grid>
      )}
      {bereavement.form.values['nextOfKin'] && (
        <Grid item xs={12}>
          <BereavementSummaryDetails
            actionButton={
              <Button
                {...changeNextOfKinDetailsButton}
                onClick={() => handleChangeButtonClick(changeNextOfKinDetailsButton?.linkKey)}
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="nextOfKin"
            fields={[
              { key: 'name', value: 'name' },
              { key: 'surname', value: 'surname' },
              { key: 'relationship', value: 'relationship' },
              { key: 'address', value: 'address' },
              { key: 'phone', value: 'phoneNumber' },
              { key: 'email', value: 'email' },
            ]}
          />
        </Grid>
      )}
      {summaryValues.shouldDisplayNextOfKinQuestionDetails && (
        <Grid item xs={12}>
          <BereavementSummaryDetails
            actionButton={
              <Button
                {...changeNextOfKinSelectionButton}
                onClick={() => handleChangeButtonClick(changeNextOfKinSelectionButton?.linkKey)}
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="nextOfKin"
            fields={[{ key: 'question', value: 'question' }]}
          />
        </Grid>
      )}
      {bereavement.form.values['executor'] && (
        <Grid item xs={12}>
          <BereavementSummaryDetails
            actionButton={
              <Button
                {...changeExecutorDetailsButton}
                onClick={() => handleChangeButtonClick(changeExecutorDetailsButton?.linkKey)}
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="executor"
            fields={[
              { key: 'name', value: 'name' },
              { key: 'surname', value: 'surname' },
              { key: 'relationship', value: 'relationship' },
              { key: 'address', value: 'address' },
              { key: 'phone', value: 'phoneNumber' },
              { key: 'email', value: 'email' },
            ]}
          />
        </Grid>
      )}
      {summaryValues.shouldDisplayExecutorQuestionDetails && (
        <Grid item xs={12}>
          <BereavementSummaryDetails
            actionButton={
              <Button
                {...changeExecutorSelectionButton}
                onClick={() => handleChangeButtonClick(changeExecutorSelectionButton?.linkKey)}
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="executor"
            fields={[{ key: 'question', value: 'question' }]}
          />
        </Grid>
      )}
      {bereavement.form.values['contactPerson'] && (
        <Grid item xs={12}>
          <BereavementSummaryDetails
            actionButton={
              <Button
                {...changeContactPersonDetailsButton}
                onClick={() => handleChangeButtonClick(changeContactPersonDetailsButton?.linkKey)}
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="contactPerson"
            fields={[
              { key: 'name', value: 'name' },
              { key: 'surname', value: 'surname' },
              { key: 'relationship', value: 'relationship' },
              { key: 'address', value: 'address' },
              { key: 'phone', value: 'phoneNumber' },
              { key: 'email', value: 'email' },
            ]}
          />
        </Grid>
      )}
      {summaryValues.shouldDisplayContactPersonQuestionDetails && (
        <Grid item xs={12}>
          <BereavementSummaryDetails
            actionButton={
              <Button
                {...changeContactPersonSelectionButton}
                onClick={() => handleChangeButtonClick(changeContactPersonSelectionButton?.linkKey)}
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="contactPerson"
            fields={[{ key: 'question', value: 'question' }]}
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <BereavementSummaryDetails
          loading={summaryValues.loading}
          actionButton={
            <Button
              {...changeDocumentsDetailsButton}
              onClick={() => handleChangeButtonClick(changeDocumentsDetailsButton?.linkKey)}
            />
          }
          prefixedLabel={prefixedLabel}
          parsedValue={summaryValues.parseValue}
          personType="documents"
          fields={[{ key: 'uploaded', value: 'uploaded' }]}
        />
      </Grid>
    </Grid>
  );

  function handleChangeButtonClick(linkKey?: string) {
    linkKey && router.parseUrlAndPush(linkKey);
  }

  function prefixedLabel(key: string) {
    return labelByKey(`bereav_confirm_det_${key}`);
  }
};
