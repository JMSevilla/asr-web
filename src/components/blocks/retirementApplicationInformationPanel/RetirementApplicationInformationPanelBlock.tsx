import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { Box, Grid, Typography } from '@mui/material';
import { differenceInYears } from 'date-fns';
import { ComponentLoader, Tooltip } from '../..';
import { CmsTenant } from '../../../api/content/types/tenant';
import { formatDate } from '../../../business/dates';
import { normalizeRetirementDate } from '../../../business/retirement';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useApi } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useResolution } from '../../../core/hooks/useResolution';
import { InformationQuotesOption } from './InformationQuotesOption';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
  tenant: CmsTenant | null;
}

export const RetirementApplicationInformationPanelBlock: React.FC<Props> = ({ id, parameters, tenant }) => {
  const { isMobile } = useResolution();
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const accessKey = useCachedAccessKey();
  const initialData = useApi(async api => {
    const [retirementApplication, retirementDate] = await Promise.all([
      api.mdp.retirementApplication(accessKey.data!.contentAccessKey),
      api.mdp.retirementDate(),
    ]);
    return {
      retirementApplication: retirementApplication.data,
      retirementDate: normalizeRetirementDate(retirementDate.data),
    };
  });

  if (initialData.loading) {
    return <ComponentLoader />;
  }

  if (initialData.error) {
    return null;
  }

  const { retirementApplication, retirementDate } = initialData.result!;

  return (
    <Box id={id} data-testid="retirement-application-information-panel">
      <Grid container>
        <Grid container item justifyContent="space-between" alignItems="flex-end" spacing={3}>
          <Grid item>
            <Typography variant="body1">{labelByKey('retirement_date')}</Typography>
            <Typography color="primary" variant="firstLevelValue" component="span" mb={3}>
              {retirementApplication.selectedRetirementDate &&
                `${formatDate(retirementApplication.selectedRetirementDate)} (${labelByKey('age')} ${
                  retirementDate &&
                  differenceInYears(
                    new Date(retirementApplication.selectedRetirementDate),
                    new Date(retirementDate.dateOfBirth),
                  )
                })`}
            </Typography>
            <Typography variant="body2">
              {labelByKey(`retirement_application_status_${retirementApplication.retirementApplicationStatus}`)}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container alignItems="center" justifyContent={isMobile ? 'flex-start' : 'flex-end'}>
              <Grid container item justifyContent={isMobile ? 'flex-start' : 'flex-end'}>
                <Box display="inline-block" alignItems="center" mr={2}>
                  <ErrorOutline fontSize="large" color="primary" />
                </Box>
                <Typography color="primary" variant="firstLevelValue" component="span" mb={3} mt={1}>
                  {`${labelByKey(retirementApplication.submissionDate ? 'submitted_on' : 'submit_by')} ${formatDate(
                    retirementApplication.submissionDate ?? retirementApplication.expirationDate!,
                  )}`}
                </Typography>
              </Grid>
              {retirementApplication.submissionDate ? (
                <Tooltip
                  header={tooltipByKey('RA_next_steps')?.header}
                  html={tooltipByKey('RA_next_steps')?.html}
                  underlinedText
                >
                  {tooltipByKey('RA_next_steps')?.text}
                </Tooltip>
              ) : (
                <Tooltip
                  header={tooltipByKey('RA_expiration_warning')?.header}
                  html={tooltipByKey('RA_expiration_warning')?.html}
                  underlinedText
                >
                  {tooltipByKey('RA_expiration_warning')?.text}
                </Tooltip>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <InformationQuotesOption option={retirementApplication} />
        </Grid>
      </Grid>
    </Box>
  );
};
