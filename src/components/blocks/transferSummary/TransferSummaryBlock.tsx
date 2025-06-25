import { Grid, Typography } from '@mui/material';
import { JourneyTypeSelection, JourneyTypes } from '../../../api/content/types/page';
import { isTrue } from '../../../business/boolean';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useRouter } from '../../../core/router';
import { Button } from '../../buttons';
import { TransferSummaryDetails } from './TransferSummaryDetails';
import { useTransferSummaryDetailsValues } from './hooks';

interface Props {
  id: string;
  pageKey: string;
  journeyType?: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
}

export const TransferSummaryBlock: React.FC<Props> = ({ id, pageKey, journeyType, parameters }) => {
  const router = useRouter();
  const { membership } = useContentDataContext();
  const { fastForward } = usePersistentAppState();
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const version3 = findValueByKey('version', parameters) === '3';
  const displayTransferRisks = isTrue(findValueByKey('display_transfer_risks', parameters));
  const transferValues = useTransferSummaryDetailsValues(labelByKey, journeyType);
  const changeFinancialAdviseDetailsButton = buttonByKey('t2_review_application_financial_advice_change');
  const changeFinancialAdviceEndPage = findValueByKey('financial_advice_change_end_page', parameters);
  const changeIfaDetailsEndPage = findValueByKey('ifa_details_change_end_page', parameters);
  const changePensionWiseDetailsEndPage = findValueByKey('pw_change_details_end_page', parameters);
  const changeSchemesDetailsEndPage = findValueByKey('schemes_details_change_end_page', parameters);
  const changeFlexibleBenefitsEndPage = findValueByKey('flex_ben_details_change_end_page', parameters);
  const changePersonalDetailsEndPage = findValueByKey('personal_details_change_end_page', parameters);
  const changeDocumentsEndPage = findValueByKey('documents_change_end_page', parameters);
  const changeTransferRisksEndPage = findValueByKey('risks_change_end_page', parameters);
  const changeIdentityDocumentsEndPage = findValueByKey('identity_documents_change_end_page', parameters);
  const changeIfaDetailsButton = buttonByKey('t2_review_application_ifa_details_change');
  const changePensionWiseDetailsButton = buttonByKey('t2_review_application_pw_details_change');
  const changeSchemeDetailsButton = buttonByKey('t2_review_application_schemes_details_change');
  const changeFlexibleBenefitsButton = buttonByKey('t2_review_application_flex_ben_details_change');
  const changePersonalDetailsButton = buttonByKey('t2_review_application_personal_details_address_change');
  const changeDocumentsDetailsButton = buttonByKey('t2_review_application_documents_change');
  const changeIdentityDocumentsDetailsButton = buttonByKey('t2_review_application_identity_documents_change');  
  const changeTransferRisksButton = buttonByKey('t2_review_application_risks_change');
  const fields = [
    { key: 'advisor_name', value: 'advisorName' },
    { key: 'company_name', value: 'companyName' },
    { key: 'optional_email', value: 'email' },
    { key: 'phone', value: 'phone' },
    { key: 'address', value: 'address' },
    { key: 'country', value: 'country' },
    { key: 'post_code', value: 'postCode' },
  ];

  return (
    <Grid container id={id} data-testid={id} spacing={12}>
      <Grid item xs={12}>
        <TransferSummaryDetails
          loading={transferValues.loading}
          actionButton={
            <Button
              {...changeFinancialAdviseDetailsButton}
              onClick={() =>
                handleChangeButtonClick(changeFinancialAdviseDetailsButton?.linkKey, changeFinancialAdviceEndPage)
              }
            >
              {changeFinancialAdviseDetailsButton?.text}
              <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('financial_advice')}</span>
            </Button>
          }
          prefixedLabel={prefixedLabel}
          parsedValue={transferValues.parseValue}
          personType="financial_advice"
          fields={[{ key: 'question', value: 'question' }]}
        />
      </Grid>
      {!!transferValues.parseValue('ifa', 'consent') && (
        <Grid item xs={12}>
          <TransferSummaryDetails
            loading={transferValues.loading}
            actionsRow={
              transferValues.parseConsent('ifa') && <Typography>{prefixedLabel('ifa_text_bellow')}</Typography>
            }
            actionButton={
              <Button
                {...changeIfaDetailsButton}
                onClick={() => handleChangeButtonClick(changeIfaDetailsButton?.linkKey, changeIfaDetailsEndPage)}
              >
                {changeIfaDetailsButton?.text}
                <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('ifa')}</span>
              </Button>
            }
            prefixedLabel={prefixedLabel}
            parsedValue={transferValues.parseValue}
            personType="ifa"
            fields={
              transferValues.parseConsent('ifa')
                ? [{ key: 'consent', value: 'consent' }, ...fields]
                : [{ key: 'consent', value: 'consent' }]
            }
          />
        </Grid>
      )}
      {version3 && !!membership?.hasAdditionalContributions && (
        <Grid item xs={12}>
          <TransferSummaryDetails
            loading={transferValues.loading}
            actionButton={
              <Button
                {...changePensionWiseDetailsButton}
                onClick={() =>
                  handleChangeButtonClick(changePensionWiseDetailsButton?.linkKey, changePensionWiseDetailsEndPage)
                }
              >
                {changePensionWiseDetailsButton?.text}
                <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('pw')}</span>
              </Button>
            }
            prefixedLabel={prefixedLabel}
            parsedValue={transferValues.parsePensionWiseValue}
            personType="pw"
            fields={
              transferValues.parsePensionWiseValue('pw', 'shouldHideRest')
                ? [{ key: transferValues.parsePensionWiseLabel('q'), value: 'question' }]
                : [
                    { key: transferValues.parsePensionWiseLabel('q'), value: 'question' },
                    { key: 'date', value: 'pensionWiseDate' },
                  ]
            }
          />
        </Grid>
      )}
      {version3 && !!membership?.hasAdditionalContributions && (
        <Grid item xs={12}>
          <TransferSummaryDetails
            loading={transferValues.loading}
            actionButton={
              <Button
                {...changeFlexibleBenefitsButton}
                onClick={() =>
                  handleChangeButtonClick(changeFlexibleBenefitsButton?.linkKey, changeFlexibleBenefitsEndPage)
                }
              >
                {changeFlexibleBenefitsButton?.text}
                <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('flex_ben')}</span>
              </Button>
            }
            prefixedLabel={prefixedLabel}
            parsedValue={transferValues.parseFlexibleBenefitsValue}
            personType="flex_ben"
            fields={
              transferValues.parseFlexibleBenefitsValue('flex_ben', 'shouldHideRest')
                ? [{ key: 'taken', value: 'benefitsTaken' }]
                : [
                    { key: 'taken', value: 'benefitsTaken' },
                    { key: 'name_of_plan', value: 'nameOfPlan' },
                    { key: 'payment_type', value: 'typeOfPayment' },
                    { key: 'payment_date', value: 'dateOfPayment' },
                  ]
            }
          />
        </Grid>
      )}
      <Grid item xs={12}>
        <TransferSummaryDetails
          loading={transferValues.loading}
          actionsRow={
            transferValues.parseConsent('schemes') && <Typography>{prefixedLabel('schemes_text_bellow')}</Typography>
          }
          actionButton={
            <Button
              {...changeSchemeDetailsButton}
              onClick={() => handleChangeButtonClick(changeSchemeDetailsButton?.linkKey, changeSchemesDetailsEndPage)}
            >
              {changeSchemeDetailsButton?.text}
              <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('schemes')}</span>
            </Button>
          }
          prefixedLabel={prefixedLabel}
          parsedValue={transferValues.parseValue}
          personType="schemes"
          fields={schemesFields(transferValues.parseConsent('schemes'), version3)}
        />
      </Grid>

      <Grid item xs={12}>
        <TransferSummaryDetails
          loading={transferValues.loading}
          actionButton={
            <Button
              {...changePersonalDetailsButton}
              onClick={() =>
                handleChangeButtonClick(changePersonalDetailsButton?.linkKey, changePersonalDetailsEndPage)
              }
            >
              {changePersonalDetailsButton?.text}
              <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('personal_details')}</span>
            </Button>
          }
          prefixedLabel={prefixedLabel}
          parsedValue={transferValues.parseUserValue}
          personType="personal_details"
          fields={[
            { key: 'name', value: 'name' },
            { key: 'dob', value: 'dateOfBirth' },
            { key: 'address', value: 'address' },
            { key: 'post_code', value: 'postCode' },
            { key: 'country', value: 'country' },
            { key: 'email', value: 'email' },
            { key: 'phone', value: 'phone' },
          ]}
        />
      </Grid>
      <Grid item xs={12}>
        <TransferSummaryDetails
          loading={transferValues.loading}
          actionButton={
            <Button
              {...changeDocumentsDetailsButton}
              onClick={() => handleChangeButtonClick(changeDocumentsDetailsButton?.linkKey, changeDocumentsEndPage)}
            >
              {changeDocumentsDetailsButton?.text}
              <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('documents')}</span>
            </Button>
          }
          prefixedLabel={prefixedLabel}
          parsedValue={transferValues.parseValue}
          personType="documents"
          fields={[{ key: 'uploaded', value: 'uploaded' }]}
        />
      </Grid>
      {displayTransferRisks && (
        <Grid item xs={12}>
          <TransferSummaryDetails
            loading={transferValues.loading}
            actionButton={
              <Button
                {...changeTransferRisksButton}
                onClick={() => handleChangeButtonClick(changeTransferRisksButton?.linkKey, changeTransferRisksEndPage)}
              >
                {changeTransferRisksButton?.text}
                <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('risks')}</span>
              </Button>
            }
            prefixedLabel={prefixedLabel}
            parsedValue={(_, key) => labelByKey(key)}
            personType="risks"
            fields={[{ key: 'rev_answers', value: 't2_review_application_risks_rev_answers_helper' }]}
          />
        </Grid>
      )}
      {transferValues.parseValue('identity_documents', 'uploadedIdentity') && (
        <Grid item xs={12}>
          <TransferSummaryDetails
            loading={transferValues.loading}
            actionButton={
              <Button
                {...changeIdentityDocumentsDetailsButton}
                onClick={() => handleChangeButtonClick(changeIdentityDocumentsDetailsButton?.linkKey, changeIdentityDocumentsEndPage)}
              >
                {changeIdentityDocumentsDetailsButton?.text}
                <span style={{ visibility: 'hidden', position: 'absolute' }}>{prefixedLabel('documents')}</span>
              </Button>
            }
            prefixedLabel={prefixedLabel}
            parsedValue={transferValues.parseValue}
            personType="identity_documents"
            fields={[{ key: 'uploaded', value: 'uploadedIdentity' }]}
          />
        </Grid>
      )}
    </Grid>
  );

  function schemesFields(isConsent: boolean, version3: boolean) {
    if (version3) {
      return isConsent
        ? [
            { key: 'consent', value: 'consent' },
            { key: 'scheme_name', value: 'schemeName' },
            ...fields,
            { key: 'occupational_q', value: 'occupationalQuestion' },
          ]
        : [
            { key: 'consent', value: 'consent' },
            { key: 'occupational_q', value: 'occupationalQuestion' },
          ];
    }

    return isConsent
      ? [{ key: 'consent', value: 'consent' }, { key: 'scheme_name', value: 'schemeName' }, ...fields]
      : [{ key: 'consent', value: 'consent' }];
  }

  function handleChangeButtonClick(linkKey?: string, nextPageKey?: string) {
    nextPageKey && fastForward.init({ nextPageKey, summaryPageKey: pageKey, journeyType: JourneyTypes.TRANSFER2 });
    linkKey && router.parseUrlAndPush(linkKey);
  }

  function prefixedLabel(key: string) {
    return labelByKey(`t2_review_application_${key}`);
  }
};
