import { Divider, Grid, Stack, Typography } from '@mui/material';
import { Button, ListLoader } from '../../';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { useRetirementContext } from '../../../core/contexts/retirement/RetirementContext';
import { AvcTransferTotal } from './AvcTransferTotal';

interface Props {
  id: string;
  buttonKey?: string;
  prefix?: string;
  headerKey?: string;
  isMessage?: boolean;
}
export const GuaranteedTransferBlock: React.FC<Props> = ({ id, buttonKey, prefix, headerKey, isMessage }) => {
  const { transferOptions, transferOptionsLoading } = useRetirementContext();
  const { membership } = useContentDataContext();
  const { buttonByKey, labelByKey } = useGlobalsContext();
  const button = buttonKey && buttonByKey(buttonKey);
  const header = headerKey && labelByKey(headerKey);

  if (transferOptionsLoading) {
    return <ListLoader id={id} loadersCount={2} spacing={6} />;
  }

  return (
    <Grid
      id={id}
      data-testid={id}
      container
      pl={6}
      py={6}
      sx={{
        backgroundColor: isMessage ? 'appColors.support80.transparentLight' : 'transparent',
        borderRadius: '4px',
        border: theme => (!isMessage ? `2px solid ${theme.palette.appColors.primary}` : 'none'),
      }}
    >
      {header && (
        <Grid item xs={12}>
          <Typography variant="h3" color={isMessage ? 'primary' : 'black'}>
            {header}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <AvcTransferTotal
          totalGuaranteedTransferValue={transferOptions?.totalGuaranteedTransferValue ?? 0}
          totalTransferValue={transferOptions?.totalTransferValue ?? 0}
          totalNonGuaranteedTransferValue={transferOptions?.totalNonGuaranteedTransferValue ?? 0}
          prefix={prefix}
          isMessage={isMessage}
          hideNonGuaranteed={!membership?.hasAdditionalContributions}
        />
      </Grid>
      {button && (
        <Grid item xs={12}>
          <Stack spacing={4}>
            <Divider sx={{ borderColor: 'primary.dark' }} />
            <Button {...button}>{button?.text}</Button>
          </Stack>
        </Grid>
      )}
    </Grid>
  );
};
