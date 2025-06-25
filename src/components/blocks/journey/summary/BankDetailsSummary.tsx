import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { MessageType } from '../../..';
import { DetailsContainer, ListLoader, PrimaryButton } from '../../../';
import { DEFAULT_PHONE_COUNTRY_CODE } from '../../../../business/constants';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useApi } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';

interface Props {
  changePageKey?: string;
}

export const BankDetailsSummary: React.FC<Props> = ({ changePageKey }) => {
  const { labelByKey } = useGlobalsContext();
  const router = useRouter();
  const { result, loading, error } = useApi(api => api.mdp.userBankDetails());
  const [bankChangeLoading, setBankChangeLoading] = useState(false);
  const resultData = result?.data;
  const { errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();

  useEffect(() => {
    const errors = error as string[] | undefined;
    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [error, showNotifications, errorByKey, hideNotifications]);

  if (loading) {
    return <ListLoader loadersCount={2} />;
  }

  if (!loading && !resultData) {
    return null;
  }

  const isUk = resultData?.bankCountryCode === DEFAULT_PHONE_COUNTRY_CODE;

  return (
    <Grid item xs={12}>
      <DetailsContainer isLoading={loading}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-bank-account-name-label">
            {labelByKey('apply_bank_account_name')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="apply-bank-account-name-value"
          >
            {resultData?.accountName}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-bank-account-number-label">
            {labelByKey('apply_bank_account_number')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="apply-bank-account-number-value"
          >
            {isUk ? resultData.accountNumber : resultData?.iban}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-bank-sortcode-label">
            {isUk ? labelByKey('apply_bank_sortcode') : labelByKey('apply_bank_bic')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="apply-bank-sortcode-value"
          >
            {isUk ? resultData.sortCode?.replace(/.{2}\B/g, '$&-') : resultData?.bic}
          </Typography>
        </Grid>
        {changePageKey && (
          <Grid container item xs={12} justifyContent="flex-end">
            <PrimaryButton
              onClick={handleBankDetailsChangeClick}
              loading={bankChangeLoading}
              data-testid="change-bank-details-button"
            >
              {labelByKey('change')}
            </PrimaryButton>
          </Grid>
        )}
      </DetailsContainer>
    </Grid>
  );

  async function handleBankDetailsChangeClick() {
    setBankChangeLoading(true);
    changePageKey && (await router.parseUrlAndPush(changePageKey));
    setBankChangeLoading(false);
  }
};
