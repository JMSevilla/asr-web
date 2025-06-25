import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { DetailsContainer, MessageType, PrimaryButton } from '../../..';
import { ListLoader } from '../../../';
import { formatDate } from '../../../../business/dates';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../../core/contexts/NotificationsContext';
import { useApi } from '../../../../core/hooks/useApi';
import { useRouter } from '../../../../core/router';

interface Props {
  changePageKey: string;
}

export const PersonalDetailsSummary: React.FC<Props> = ({ changePageKey }) => {
  const { labelByKey } = useGlobalsContext();
  const router = useRouter();
  const initialApiData = useApi(api => Promise.all([api.mdp.userPersonalDetails(), api.mdp.userAddress()]));
  const [personDetails, userAddress] = initialApiData.result ?? [null, null];
  const userEmail = useApi(api => api.mdp.userEmail());
  const userPhone = useApi(api => api.mdp.userPhone());
  const [personalDataChangeLoading, setPersonalDataChangeLoading] = useState(false);
  const { errorByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();

  useEffect(() => {
    const errors = initialApiData.error as string[] | undefined;

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [initialApiData.error, showNotifications, errorByKey, hideNotifications]);

  if (initialApiData.loading) {
    return <ListLoader loadersCount={3} />;
  }

  return (
    <Grid item xs={12}>
      <DetailsContainer isLoading={initialApiData.loading || userEmail.loading || userPhone.loading}>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-member-name-label">
            {labelByKey('apply_member_name')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="primary" variant="secondLevelValue" component="span" data-testid="apply-member-name-value">
            {personDetails?.data.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-member-dob-label">
            {labelByKey('apply_member_dob')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography color="primary" variant="secondLevelValue" component="span" data-testid="apply-member-dob-value">
            {personDetails ? formatDate(personDetails.data.dateOfBirth) : ''}
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-member-address-label">
            {labelByKey('apply_member_address')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} display="flex" flexDirection="column">
          {userAddress?.data.streetAddress1 && (
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="apply-member-address-1-value"
            >
              {userAddress?.data.streetAddress1}
            </Typography>
          )}
          {userAddress?.data.streetAddress2 && (
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="apply-member-address-2-value"
            >
              {userAddress?.data.streetAddress2}
            </Typography>
          )}
          {userAddress?.data.streetAddress3 && (
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="apply-member-address-3-value"
            >
              {userAddress?.data.streetAddress3}
            </Typography>
          )}
          {userAddress?.data.streetAddress4 && (
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="apply-member-address-4-value"
            >
              {userAddress?.data.streetAddress4}
            </Typography>
          )}
          {userAddress?.data.streetAddress5 && (
            <Typography
              color="primary"
              variant="secondLevelValue"
              component="span"
              data-testid="apply-member-address-5-value"
            >
              {userAddress?.data.streetAddress5}
            </Typography>
          )}
        </Grid>
        {userAddress?.data.postCode && (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" fontWeight="bold" data-testid="apply-member-postcode-label">
                {labelByKey('apply_member_postcode')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                color="primary"
                variant="secondLevelValue"
                component="span"
                data-testid="apply-member-postcode-value"
              >
                {userAddress?.data.postCode}
              </Typography>
            </Grid>
          </>
        )}
        {userAddress?.data.country && (
          <>
            <Grid item xs={12} md={6}>
              <Typography variant="body1" fontWeight="bold" data-testid="apply-member-country-label">
                {labelByKey('apply_member_country')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                color="primary"
                variant="secondLevelValue"
                component="span"
                data-testid="apply-member-country-value"
              >
                {userAddress?.data.country}
              </Typography>
            </Grid>
          </>
        )}
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-member-email-label">
            {labelByKey('apply_member_email')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ width: '150px' }}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            noWrap
            data-testid="apply-member-email-value"
          >
            {userEmail.result?.data.email}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="body1" fontWeight="bold" data-testid="apply-member-phone-label">
            {labelByKey('apply_member_phone')}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            color="primary"
            variant="secondLevelValue"
            component="span"
            data-testid="apply-member-phone-value"
          >
            {`+${userPhone.result?.data.code} ${userPhone.result?.data.number}`}
          </Typography>
        </Grid>

        {changePageKey && (
          <Grid container item xs={12} justifyContent="flex-end">
            <PrimaryButton
              onClick={handlePersonalDataDetailsChangeClick}
              loading={personalDataChangeLoading}
              data-testid="change-personal-details-button"
            >
              {labelByKey('change')}
            </PrimaryButton>
          </Grid>
        )}
      </DetailsContainer>
    </Grid>
  );

  async function handlePersonalDataDetailsChangeClick() {
    setPersonalDataChangeLoading(true);
    await router.parseUrlAndPush(changePageKey);
  }
};
