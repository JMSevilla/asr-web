import { CheckCircleOutlineOutlined, WarningAmberRounded } from '@mui/icons-material';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Badge } from '../..';
import { currencyValue } from '../../../business/currency';
import { formatDate, timelessDateString } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useApi } from '../../../core/hooks/useApi';
import { Tooltip } from '../../Tooltip';

interface Props {
  id: string;
}

export const TransferApplicationDetailsBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey, tooltipByKey } = useGlobalsContext();
  const { membership } = useContentDataContext();
  const transferApplicationtValues = useApi(api => api.mdp.transferJourneyTransferApplication());
  const submitedTooltip = tooltipByKey(`${id}_tooltip_submited`);

  if (transferApplicationtValues.loading) return null;

  const status = transferApplicationtValues.result?.data.transferApplicationStatus;
  const submitDate = transferApplicationtValues.result?.data.submissionDate;
  const submitByDate = transferApplicationtValues.result?.data?.submitByDate;
  const guaranteedTransferValue = transferApplicationtValues.result?.data.totalGuaranteedTransferValue;
  const nonGuaranteedTransferValue = transferApplicationtValues.result?.data.totalNonGuaranteedTransferValue;
  const isSubmitted = status === 'SubmittedTA' || status === 'OutsideTA';

  return (
    <Grid id={id} container spacing={6} data-testid={id} flexWrap={{ xs: 'wrap', md: 'nowrap' }}>
      <Grid container item xs={12} md={6} spacing={6}>
        <Grid item xs={12} display="flex">
          <Typography component="h2" mr={2}>
            {labelByKey(`${id}_application_progress`)}
          </Typography>
          <Typography component="h2" fontWeight="bold">
            {statusLabel(status)}
          </Typography>
        </Grid>
        <Grid item xs={12} display="flex">
          <Typography color="primary" variant="h1" component="h2" fontWeight="bold">
            <Stack direction="row">
              {isSubmitted ? (
                <>
                  <CheckCircleOutlineOutlined fontSize="large" color="success" sx={{ mr: 2 }} />
                  {`${labelByKey(`${id}_submited_on`)} ${submitDate ? formatDate(timelessDateString(submitDate)) : ''}`}
                </>
              ) : (
                <>
                  <WarningAmberRounded fontSize="large" color="warning" sx={{ mr: 2 }} />
                  {`${labelByKey(`${id}_submited_by`)} ${
                    submitByDate ? formatDate(timelessDateString(submitByDate)) : ''
                  }`}
                </>
              )}
            </Stack>
          </Typography>
        </Grid>
        <Grid item xs={12} display="flex">
          {isSubmitted && (
            <Tooltip header={submitedTooltip?.header} html={submitedTooltip?.html} underlinedText>
              {submitedTooltip?.text}
            </Tooltip>
          )}
        </Grid>
      </Grid>
      {(!!guaranteedTransferValue || !!nonGuaranteedTransferValue) && (
        <Grid container item xs={12} md={6}>
          <Stack flex={1} alignItems="flex-end" gap={6}>
            <Typography component="h3" textAlign="right">
              {labelByKey(`${id}_transfer_value`)}
            </Typography>
            {!!guaranteedTransferValue && (
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
                <Box>
                  <Badge
                    data-testid="transfer-quote-db-value-status"
                    text={labelByKey(`${id}_total_value_guaranteed`)}
                  />
                </Box>
                <Typography color="primary" fontWeight="bold" variant="h2">{`${labelByKey(
                  'currency:GBP',
                )}${currencyValue(guaranteedTransferValue)}`}</Typography>
              </Stack>
            )}
            {!!membership?.hasAdditionalContributions && !!nonGuaranteedTransferValue && (
              <Stack direction="row" alignItems="center" justifyContent="flex-end" gap={2}>
                <Box>
                  <Badge
                    data-testid="transfer-quote-dc-value-status"
                    text={labelByKey(`${id}_total_value_not_guaranteed`)}
                    backgroundColor="transparent"
                    color="appColors.primary"
                    borderColor="appColors.primary"
                  />
                </Box>
                <Typography color="primary" fontWeight="bold" variant="h2">{`${labelByKey(
                  'currency:GBP',
                )}${currencyValue(nonGuaranteedTransferValue)}`}</Typography>
              </Stack>
            )}
          </Stack>
        </Grid>
      )}
    </Grid>
  );

  function statusLabel(status?: string) {
    switch (status) {
      case 'SubmittedTA':
      case 'OutsideTA':
        return labelByKey(`${id}_submited`);
      default:
        return labelByKey(`${id}_incomplete`);
    }
  }
};
