import { Box, Divider, Grid, Typography } from '@mui/material';
import { InputLoader } from '../../..';

interface Props {
  label: string;
  value: string;
  infoLabel?: string;
  loading?: boolean;
  valueDataTestId?: string;
}

export const PartialTransferCalculatorResultField: React.FC<Props> = ({
  value,
  label,
  loading,
  infoLabel,
  valueDataTestId,
}) => {
  return (
    <Grid item xs={12} container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="body1" fontWeight="bold">
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12} position="relative" height={theme => theme.spacing(11)}>
        {loading ? (
          <Box position="absolute" width="100%" top={theme => theme.spacing(1)}>
            <InputLoader />
          </Box>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{ color: theme => theme.palette.appColors.essential['100'] }}
              data-testid={valueDataTestId}
            >
              {value}
            </Typography>
            <Divider />
          </>
        )}
      </Grid>
      {infoLabel && (
        <Grid item>
          <Typography variant="body1">{infoLabel}</Typography>
        </Grid>
      )}
    </Grid>
  );
};
