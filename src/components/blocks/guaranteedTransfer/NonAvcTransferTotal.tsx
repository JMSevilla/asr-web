import { Grid, Typography } from '@mui/material';
import { currencyValue } from '../../../business/currency';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { formKey } from './utils';

interface Props {
  totalGuaranteedTransferValue: number;
  prefix?: string;
}

export const NonAvcTransferTotal: React.FC<Props> = ({ totalGuaranteedTransferValue, prefix }) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();

  return (
    <Grid container pr={6}>
      <Grid item container mb={6} xs={12}>
        <Grid item sm={6} xs={12}>
          <Typography fontWeight="bold" variant="h5">
            {labelByKey(formKey('value_non_AVCs', prefix))}
          </Typography>
        </Grid>
        <Grid item sm={6} xs={12} sx={{ textAlign: 'right' }}>
          <Typography color="primary" variant="h3" component="span" data-testid="transfer-quote-value-non-AVCs">
            {`${labelByKey('currency:GBP')}${currencyValue(totalGuaranteedTransferValue)}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} mb={6}>
        <Typography variant="body1">{htmlByKey(formKey('value_non_AVCs_text', prefix))}</Typography>
      </Grid>
    </Grid>
  );
};
