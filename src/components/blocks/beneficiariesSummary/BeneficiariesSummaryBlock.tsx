import { Grid, Typography } from '@mui/material';
import { FC } from 'react';
import { AccessKey } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { PrimaryButton, SecondaryButton } from '../../buttons';
import { BeneficiariesLoader } from './BeneficiariesLoader';
import { BeneficiariesSummaryTable } from './beneficiaryWizardForm/BeneficiariesSummaryForm';
import { mapBeneficiariesToWizardFormValues } from './beneficiaryWizardForm/utils';
interface Props {
  id: string;
  parameters: { key: string; value: string }[];
}

export const BeneficiariesSummaryBlock: FC<Props> = ({ id, parameters }) => {
  const router = useRouter();
  const accessKey = useCachedAccessKey();
  const { labelByKey } = useGlobalsContext();
  const updatePageKey = findValueByKey('update_beneficiaries_summary_page', parameters) ?? '';
  const beneficiaries = useApi(async api => await api.mdp.beneficiaries());
  const downloadPdfCb = useApiCallback((api, key: AccessKey) => api.mdp.downloadBeneficiaries(key));

  if (beneficiaries.loading) return <BeneficiariesLoader id={id} />;

  return (
    <div id={id} data-testid={id}>
      <Typography variant="h2">{labelByKey('beneficiaries_summary_header_title')}</Typography>
      <Grid container spacing={12}>
        <Grid item xs={12}>
          <BeneficiariesSummaryTable
            isEditable={false}
            isLoading={beneficiaries.loading}
            beneficiaries={mapBeneficiariesToWizardFormValues(beneficiaries.result?.data.beneficiaries)}
          />
        </Grid>
        <Grid item xs={12} container spacing={4}>
          <Grid item xs={12} md={4}>
            <PrimaryButton
              fullWidth
              onClick={onUpdateClicked}
              loading={router.loading || router.parsing}
              data-testid="update-beneficiaries-btn"
            >
              {labelByKey('beneficiaries_summary_update_button')}
            </PrimaryButton>
          </Grid>
          {!!beneficiaries.result?.data.beneficiaries?.length && (
            <Grid item xs={12} md={6}>
              <SecondaryButton
                fullWidth
                onClick={onDownloadClicked}
                loading={downloadPdfCb.loading}
                data-testid="download-beneficiaries-btn"
              >
                {labelByKey('beneficiaries_summary_download_pdf_button')}
              </SecondaryButton>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );

  function onUpdateClicked() {
    router.parseUrlAndPush(updatePageKey);
  }

  async function onDownloadClicked() {
    await downloadPdfCb.execute({ contentAccessKey: accessKey.data?.contentAccessKey ?? '' });
  }
};
