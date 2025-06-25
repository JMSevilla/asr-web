import { Box, Grid, List, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { ListLoader } from '../..';
import { formatDate } from '../../../business/dates';
import { openInNewTab } from '../../../business/navigation';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { Button } from '../../buttons';
import { MessageType } from '../../topAlertMessages';
import { MemberListItem } from './MemberListItem';
interface Props {
  id?: string;
}

export const MembershipDetailsBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey, buttonByKey } = useGlobalsContext();
  const router = useRouter();
  const membershipData = useApi(api => api.mdp.membershipData());
  const parseUrlCb = useApiCallback((api, key: string) => api.content.urlFromKey(key));
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { errorByKey } = useGlobalsContext();

  useEffect(() => {
    const errors = membershipData.error as string[] | undefined;

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [membershipData.error]);

  if (membershipData.loading) {
    return <ListLoader id={id} loadersCount={6} />;
  }

  const membership = membershipData?.result?.data;
  const button = buttonByKey('membership_details_change_button');
  return (
    <Box id={id} mb={12}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontWeight="bold">
            {labelByKey('my_details_membership')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List>
            <MemberListItem
              data-testid="my_details_scheme_name"
              text={labelByKey('my_details_scheme_name')}
              value={`${membership?.schemeName ?? labelByKey('not_available')}`}
            />
            {membership?.category && (
              <MemberListItem
                data-testid="my_details_membership_category"
                text={labelByKey('my_details_membership_category')}
                value={membership.category}
              />
            )}
            {membership?.membershipNumber && (
              <MemberListItem
                data-testid="my_details_membership_number"
                text={labelByKey('my_details_membership_number')}
                value={membership.membershipNumber}
              />
            )}
            {membership?.status && (
              <MemberListItem
                data-testid="my_details_scheme_status"
                text={labelByKey('my_details_scheme_status')}
                value={membership.status}
              />
            )}
            {membership?.payrollNumber && (
              <MemberListItem
                data-testid="my_details_payroll_ref"
                text={labelByKey('my_details_payroll_ref')}
                value={membership.payrollNumber}
              />
            )}
            {membership?.dateJoinedScheme && (
              <MemberListItem
                data-testid="my_details_scheme_date_joined"
                text={labelByKey('my_details_scheme_date_joined')}
                value={formatDate(membership.dateJoinedScheme)}
              />
            )}
            {membership?.dateLeftScheme && (
              <MemberListItem
                data-testid="my_details_scheme_date_left"
                text={labelByKey('my_details_scheme_date_left')}
                value={formatDate(membership.dateLeftScheme)}
              />
            )}
            {membership?.datePensionableServiceStarted && (
              <MemberListItem
                data-testid="my_details_date_pension_service_started"
                text={labelByKey('my_details_date_pension_service_started')}
                value={formatDate(membership.datePensionableServiceStarted)}
              />
            )}
          </List>
        </Grid>
        {button && (
          <Grid item xs={12}>
            <Button
              {...button}
              data-testid="membership-details-action-btn"
              onClick={onClick}
              loading={parseUrlCb.loading || router.loading}
            >
              {button?.text}
            </Button>
          </Grid>
        )}
      </Grid>
    </Box>
  );

  async function onClick() {
    const parsedButtonLink = button?.linkKey ? await parseUrlCb.execute(button.linkKey) : null;
    const redirectUrl = parsedButtonLink?.data?.url;

    if (!redirectUrl) return;

    button?.openInTheNewTab ? openInNewTab(redirectUrl) : router.push(redirectUrl);
  }
};
