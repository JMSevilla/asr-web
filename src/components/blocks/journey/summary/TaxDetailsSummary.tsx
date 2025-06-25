import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DetailsContainer, MessageType, PrimaryButton } from '../../..';
import { ListLoader } from '../../../';
import { COUNTRY_LIST } from '../../../../business/constants';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useContentDataContext } from '../../../../core/contexts/contentData/ContentDataContext';
import { useApi } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';

interface Props {
  changePageKey?: string;
  pageKey: string;
}

export const TaxDetailsSummary: React.FC<Props> = ({ changePageKey }) => {
  const { labelByKey } = useGlobalsContext();
  const router = useRouter();
  const { cmsTokens } = useContentDataContext();
  const userAddress = useApi(api => api.mdp.userAddress());
  const lta = useApi(api => api.mdp.lifetimeAllowance());
  const [taxChangeLoading, setTaxChangeLoading] = useState(false);
  const { errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();

  useEffect(() => {
    const errors = userAddress.error as string[] | undefined;

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [userAddress.error, showNotifications, errorByKey, hideNotifications]);

  const country = COUNTRY_LIST.find(country => country.countryCode === userAddress.result?.data.countryCode);

  if (userAddress.loading) {
    return <ListLoader loadersCount={2} />;
  }

  return (
    <Grid item xs={12}>
      <DetailsContainer isLoading={userAddress.loading}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-tax-country-label">
            {labelByKey('apply_tax_country')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="primary" variant="secondLevelValue" component="span" data-testid="apply-tax-country-value">
            {country?.countryName}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-tax-pension-income-label">
            {labelByKey('apply_tax_pension_income')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} display="flex" flexDirection="column">
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="apply-tax-lta-protection-no-label"
          >
            {labelByKey('apply_tax_lta_protection_no')}
          </Typography>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="apply-tax-lta-percentage-value"
          >
            {`${lta.result?.data?.percentage ?? 0}% ${labelByKey('apply_tax_lta_used_outside')}`}
          </Typography>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="apply-tax-lta-chosen-percentage-value"
          >
            {`${cmsTokens?.chosenLtaPercentage ?? 0}% ${labelByKey('apply_tax_lta_used_application')}`}
          </Typography>
        </Grid>
        {changePageKey && (
          <Grid container item xs={12} justifyContent="flex-end">
            <PrimaryButton
              onClick={handleTaxDetailsChangeClick}
              loading={taxChangeLoading}
              data-testid="change-tax-details-button"
            >
              {labelByKey('change')}
            </PrimaryButton>
          </Grid>
        )}
      </DetailsContainer>
    </Grid>
  );

  async function handleTaxDetailsChangeClick() {
    setTaxChangeLoading(true);
    changePageKey && (await router.parseUrlAndPush(changePageKey));
    setTaxChangeLoading(false);
  }
};
