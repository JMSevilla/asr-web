import { Grid } from '@mui/material';
import { findValueByKey } from '../../../business/find-in-array';
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

export const BereavementSummaryBlock: React.FC<Props> = ({ id, parameters, pageKey }) => {
  const router = useRouter();
  const { labelByKey, buttonByKey, classifierByKey } = useGlobalsContext();
  const { bereavement } = usePersistentAppState();
  const relationshipOptions = classifierByKey('bereavement_relationships');
  const summaryValues = useBereavementSummaryDetailsValues(prefixedLabel, parameters, relationshipOptions);
  const changeDeceasedDetailsButton = buttonByKey('bereav_confirm_det_deceased_change');
  const changeDeceasedDetailsEndPage = findValueByKey('change_deceased_end_page', parameters);
  const changeReporterDetailsButton = buttonByKey('bereav_confirm_det_reporter_change');
  const changeReporterDetailsEndPage = findValueByKey('change_reporter_end_page', parameters);
  const changeNextOfKinDetailsButton = buttonByKey('bereav_confirm_det_nextOfKin_change');
  const changeNextOfKinDetailsEndPage = findValueByKey('change_nextOfKin_end_page', parameters);
  const changeNextOfKinSelectionButton = buttonByKey('bereav_confirm_det_nextOfKin_selection_change');
  const changeNextOfKinSelectionEndPage = findValueByKey('change_nextOfKin_selection_end_page', parameters);
  const changeExecutorDetailsButton = buttonByKey('bereav_confirm_det_executor_change');
  const changeExecutorDetailsEndPage = findValueByKey('change_executor_end_page', parameters);
  const changeExecutorSelectionButton = buttonByKey('bereav_confirm_det_executor_selection_change');
  const changeExecutorSelectionEndPage = findValueByKey('change_executor_selection_end_page', parameters);
  const changeContactPersonDetailsButton = buttonByKey('bereav_confirm_det_contactPerson_change');
  const changeContactPersonDetailsEndPage = findValueByKey('change_contactPerson_end_page', parameters);
  const changeContactPersonSelectionButton = buttonByKey('bereav_confirm_det_contactPerson_selection_change');
  const changeContactPersonSelectionEndPage = findValueByKey('change_who_contact_end_page', parameters);
  const changeContactPersonSelectionPageKey = findValueByKey('contact_selection_page', parameters);

  return (
    <Grid container id={id} spacing={12}>
      <Grid item xs={12}>
        <BereavementSummaryDetails
          loading={summaryValues.loading}
          actionButton={
            <Button
              {...changeDeceasedDetailsButton}
              onClick={() =>
                handleChangeButtonClick(changeDeceasedDetailsButton?.linkKey, changeDeceasedDetailsEndPage)
              }
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
                onClick={() =>
                  handleChangeButtonClick(changeReporterDetailsButton?.linkKey, changeReporterDetailsEndPage)
                }
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
                onClick={() =>
                  handleChangeButtonClick(changeNextOfKinDetailsButton?.linkKey, changeNextOfKinDetailsEndPage)
                }
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
                onClick={() =>
                  handleChangeButtonClick(changeNextOfKinSelectionButton?.linkKey, changeNextOfKinSelectionEndPage)
                }
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
                onClick={() =>
                  handleChangeButtonClick(changeExecutorDetailsButton?.linkKey, changeExecutorDetailsEndPage)
                }
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
                onClick={() =>
                  handleChangeButtonClick(changeExecutorSelectionButton?.linkKey, changeExecutorSelectionEndPage)
                }
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
                onClick={() =>
                  handleChangeButtonClick(changeContactPersonDetailsButton?.linkKey, changeContactPersonDetailsEndPage)
                }
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
                onClick={() =>
                  handleChangeButtonClick(
                    changeContactPersonSelectionButton?.linkKey,
                    changeContactPersonSelectionEndPage,
                  )
                }
              />
            }
            prefixedLabel={prefixedLabel}
            parsedValue={summaryValues.parseValue}
            personType="contactPerson"
            fields={[{ key: 'question', value: 'question' }]}
          />
        </Grid>
      )}
    </Grid>
  );

  function handleChangeButtonClick(linkKey?: string, nextPageKey?: string) {
    // TODO enable it or remove fully according client request
    // nextPageKey &&
    //   changeContactPersonSelectionPageKey &&
    //   bereavement.form.startEdit({
    //     nextPageKey,
    //     summaryPageKey: pageKey,
    //     contactPageKey: changeContactPersonSelectionPageKey,
    //   });
    linkKey && router.parseUrlAndPush(linkKey);
  }

  function prefixedLabel(key: string) {
    return labelByKey(`bereav_confirm_det_${key}`);
  }
};
