import { Grid, Typography } from '@mui/material';
import { Badge } from '../../';
import { currencyValue } from '../../../business/currency';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { formKey } from './utils';

interface Props {
  totalTransferValue: number;
  totalGuaranteedTransferValue: number;
  totalNonGuaranteedTransferValue: number;
  prefix?: string;
  isMessage?: boolean;
  hideNonGuaranteed?: boolean;
}

export const AvcTransferTotal: React.FC<Props> = ({
  totalTransferValue,
  totalGuaranteedTransferValue,
  totalNonGuaranteedTransferValue,
  prefix,
  isMessage,
  hideNonGuaranteed = false,
}) => {
  const { labelByKey, htmlByKey } = useGlobalsContext();

  return (
    <Grid container width="100%" spacing={6}>
      <Grid item sm={isMessage ? 7 : 8} xs={12}>
        <Typography
          id={formKey('total_value', prefix)}
          fontWeight={isMessage ? 'bold' : 'normal'}
          variant={isMessage ? 'h3' : 'h2'}
          color={isMessage ? 'primary' : 'black'}
        >
          {labelByKey(formKey('total_value', prefix))}
        </Typography>
      </Grid>
      <Grid item sm={isMessage ? 5 : 4} xs={12} sx={{ textAlign: 'right' }}>
        <Typography
          aria-describedby={formKey('total_value', prefix)}
          fontWeight={isMessage ? 'normal' : 'bold'}
          color="primary"
          variant={isMessage ? 'h3' : 'h2'}
          component="span"
          data-testid="transfer-quote-total-value"
        >
          {currencyText(totalTransferValue)}
        </Typography>
      </Grid>
      <Grid item xs={12} container>
        <Grid container item sm={isMessage ? 7 : 9} xs={12} spacing={6}>
          <Grid item xs={12} display={isMessage ? '' : 'flex'}>
            <Typography
              id={formKey('db_value', prefix)}
              variant="h5"
              component="h3"
              mr={2}
              color={isMessage ? 'primary' : 'black'}
            >
              {labelByKey(formKey('db_value', prefix))}
            </Typography>
            <Badge
              data-testid="transfer-quote-db-value-status"
              text={labelByKey(formKey('total_value_guaranteed', prefix))}
            />
          </Grid>
          {!isMessage && (
            <Grid item xs={12}>
              <Typography variant="body1">{htmlByKey(formKey('db_text', prefix))}</Typography>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} sm={isMessage ? 5 : 3} sx={{ textAlign: 'right' }}>
          <Typography
            aria-describedby={formKey('db_value', prefix)}
            color="primary"
            variant="h3"
            component="span"
            data-testid="transfer-quote-db-value"
          >
            {currencyText(totalGuaranteedTransferValue)}
          </Typography>
        </Grid>
      </Grid>
      {!hideNonGuaranteed && (
        <Grid item xs={12} container>
          <Grid item container sm={isMessage ? 7 : 9} xs={12} spacing={6}>
            <Grid item xs={12} display={isMessage ? '' : 'flex'}>
              <Typography
                id={formKey('dc_value', prefix)}
                variant="h5"
                component="h3"
                mr={2}
                color={isMessage ? 'primary' : 'black'}
              >
                {labelByKey(formKey('dc_value', prefix))}
              </Typography>
              <Badge
                data-testid="transfer-quote-dc-value-status"
                text={labelByKey(formKey('total_value_not_guaranteed', prefix))}
                backgroundColor="transparent"
                color="appColors.primary"
                borderColor="appColors.primary"
              />
            </Grid>
            {!isMessage && (
              <Grid item xs={12}>
                <Typography variant="body1">{htmlByKey(formKey('dc_text', prefix))}</Typography>
              </Grid>
            )}
          </Grid>
          <Grid item sm={isMessage ? 5 : 3} xs={12} sx={{ textAlign: 'right' }}>
            <Typography
              aria-describedby={formKey('dc_value', prefix)}
              color="primary"
              variant="h3"
              component="span"
              data-testid="transfer-quote-dc-value"
            >
              {currencyText(totalNonGuaranteedTransferValue)}
            </Typography>
          </Grid>
        </Grid>
      )}
    </Grid>
  );

  function currencyText(value?: string | number | null): string {
    return `${labelByKey('currency:GBP')}${currencyValue(value)}`;
  }
};
