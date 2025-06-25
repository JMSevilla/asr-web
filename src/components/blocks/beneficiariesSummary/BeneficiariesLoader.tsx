import { Grid } from '@mui/material';
import { ListLoader } from '../../';

export const BeneficiariesLoader: React.FC<{ id?: string }> = ({ id }) => (
  <Grid container id={id} sx={{ backgroundColor: 'appColors.support80.transparentLight' }} padding={8}>
    <Grid item xs={6}>
      <ListLoader />
    </Grid>
    <Grid item xs={6}>
      <ListLoader />
    </Grid>
  </Grid>
);
