import { Divider, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Button, DetailsContainer } from '../../..';
import { JourneyTypeSelection } from '../../../../api/content/types/page';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useApi } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';

interface Props {
  journeyType: JourneyTypeSelection;
  changeWitnessPageKey: string;
  changeSpousePageKey: string;
  witnessName: string;
  spouseName: string;
}

export const SurrenderPensionSummary: React.FC<Props> = ({
  journeyType,
  witnessName,
  spouseName,
  changeWitnessPageKey,
  changeSpousePageKey,
}) => {
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const router = useRouter();
  const [changeWitnessLoading, setChangeWitnessLoading] = useState(false);
  const [changeSpouseLoading, setChangeSpouseLoading] = useState(false);
  const initialData = useApi(
    async api => {
      const [allData, spouseData] = await Promise.allSettled([
        api.mdp.genericJourneyAllData(journeyType),
        api.mdp.questionsStepData('sspb'),
      ]);

      return {
        spouseData: spouseData.status === 'fulfilled' ? spouseData.value.data : undefined,
        checkboxes:
          allData.status === 'fulfilled'
            ? {
                witness: Object.values(
                  allData.value.data.journey?.stepsWithCheckboxes?.['sspa']?.['Ret_sp_witness_details_list'] || {},
                ),
                spouse: Object.values(
                  allData.value.data.journey?.stepsWithCheckboxes?.['sspc']?.['sp_spouse_confirm_list'] || {},
                ),
              }
            : undefined,
      };
    },
    [journeyType],
  );

  const changeWitnessButton = buttonByKey('surrender_pension_change_witness_btn');
  const changeSpouseButton = buttonByKey('surrender_pension_change_spouse_btn');

  const hideSpouseDetails = initialData.result?.spouseData?.answerKey === 'I_dont_have';

  return (
    <Grid item xs={12} data-testid="surrender-pension-summary">
      <DetailsContainer isLoading={initialData.loading}>
        <Grid item xs={12} md={6}>
          <Typography
            maxWidth={{ md: '60%' }}
            variant="body1"
            fontWeight="bold"
            data-testid="surrender_pension_witness_details_checkbox_1"
          >
            {labelByKey('surrender_pension_witness_details_checkbox_1')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="surrender_pension_witness_details_checkbox_1_value"
          >
            {initialData.result?.checkboxes?.witness?.[0]?.answerValue ? labelByKey('yes') : labelByKey('no')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            maxWidth={{ md: '60%' }}
            variant="body1"
            fontWeight="bold"
            data-testid="surrender_pension_witness_details_checkbox_2"
          >
            {labelByKey('surrender_pension_witness_details_checkbox_2')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="surrender_pension_witness_details_checkbox_2_value"
          >
            {initialData.result?.checkboxes?.witness?.[1]?.answerValue ? labelByKey('yes') : labelByKey('no')}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography
            maxWidth={{ md: '60%' }}
            variant="body1"
            fontWeight="bold"
            data-testid="surrender_pension_witness_name"
          >
            {labelByKey('surrender_pension_witness_name')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="surrender_pension_witness_name_value"
          >
            {witnessName}
          </Typography>
        </Grid>

        {changeWitnessButton && (
          <Grid container item xs={12} justifyContent="flex-end">
            <Button
              {...changeWitnessButton}
              onClick={handleWitnessChangeClick}
              loading={changeWitnessLoading}
              data-testid="change-surrender-pension-witness-button"
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {hideSpouseDetails && initialData.result?.spouseData && (
          <>
            <Grid item xs={12} md={6}>
              <Typography
                maxWidth={{ md: '60%' }}
                variant="body1"
                fontWeight="bold"
                data-testid="surrender_pension_spouse_details_question_1"
              >
                {labelByKey('surrender_pension_spouse_details_question_1')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                color="primary"
                variant="secondLevelValue"
                component="span"
                data-testid="surrender_pension_spouse_details_question_1_value"
              >
                {labelByKey(initialData.result.spouseData.answerKey)}
              </Typography>
            </Grid>
          </>
        )}

        {!hideSpouseDetails && (
          <>
            <Grid item xs={12} md={6}>
              <Typography
                maxWidth={{ md: '60%' }}
                variant="body1"
                fontWeight="bold"
                data-testid="surrender_pension_spouse_details_checkbox_1"
              >
                {labelByKey('surrender_pension_spouse_details_checkbox_1')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                color="primary"
                variant="secondLevelValue"
                component="span"
                data-testid="surrender_pension_spouse_details_checkbox_1_value"
              >
                {initialData.result?.checkboxes?.spouse?.[0]?.answerValue ? labelByKey('yes') : labelByKey('no')}
              </Typography>
            </Grid>
          </>
        )}

        {!hideSpouseDetails && (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" fontWeight="bold" data-testid="surrender_pension_spouse_name">
                {labelByKey('surrender_pension_spouse_name')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                color="primary"
                variant="secondLevelValue"
                component="span"
                data-testid="surrender_pension_witness_name_value"
              >
                {spouseName}
              </Typography>
            </Grid>
          </>
        )}

        {changeSpouseButton && (
          <Grid container item xs={12} justifyContent="flex-end">
            <Button
              {...changeSpouseButton}
              onClick={handleSpouseChangeClick}
              loading={changeSpouseLoading}
              data-testid="change-surrender-pension-spouse-button"
            />
          </Grid>
        )}

        {!hideSpouseDetails && (
          <Grid item xs={12}>
            <Typography variant="body1" data-testid="surrender_pension_spouse_description">
              {labelByKey('surrender_pension_spouse_description')}
            </Typography>
          </Grid>
        )}
      </DetailsContainer>
    </Grid>
  );

  async function handleWitnessChangeClick() {
    setChangeWitnessLoading(true);
    await router.parseUrlAndPush(changeWitnessPageKey);
  }

  async function handleSpouseChangeClick() {
    setChangeSpouseLoading(true);
    await router.parseUrlAndPush(changeSpousePageKey);
  }
};
