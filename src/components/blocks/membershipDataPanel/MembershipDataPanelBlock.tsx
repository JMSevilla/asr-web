import { Box, Grid, List, ListItem as MuiListItem, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { ListLoader } from '../..';
import { currencyValue } from '../../../business/currency';
import { formatDate } from '../../../business/dates';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { Tooltip } from '../../Tooltip';
import { MessageType } from '../../topAlertMessages';

interface Props {
  id?: string;
}

export const MembershipDataPanelBlock: React.FC<Props> = ({ id }) => {
  const { labelByKey } = useGlobalsContext();
  const membershipData = useApi(api => api.mdp.membershipData());
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { errorByKey, tooltipByKey } = useGlobalsContext();
  const tooltip = tooltipByKey('membership_summary_final_salary_tooltip');

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
    return <ListLoader id={id} loadersCount={3} />;
  }

  return (
    <Box id={id} p={12} mb={4} sx={{ backgroundColor: 'appColors.support80.transparentLight' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontWeight="bold">
            {labelByKey('membership_data_panel_title')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List>
            <ListItem
              id="member-name"
              text={labelByKey('membership_data_panel_name')}
              value={`${membershipData.result?.data?.forenames ?? ''} ${membershipData.result?.data?.surname ?? ''}`}
            />
            <ListItem
              id="member-ref-number"
              text={labelByKey('membership_data_panel_ref_number')}
              value={membershipData.result?.data?.referenceNumber ?? ''}
            />
            {membershipData.result?.data?.dateOfBirth && (
              <ListItem
                id="member-date-of-birth"
                text={labelByKey('membership_data_panel_date_of_birth')}
                value={formatDate(membershipData.result.data.dateOfBirth)}
              />
            )}
            {membershipData.result?.data?.normalRetirementDate && (
              <ListItem
                id="member-retirement-date"
                text={labelByKey('membership_data_panel_normal_retirement_date')}
                value={formatDate(membershipData.result.data.normalRetirementDate)}
              />
            )}
            {membershipData.result?.data?.datePensionableServiceStarted && (
              <ListItem
                id="member-pension-service-start-date"
                text={labelByKey('membership_data_panel_pension_service_start_date')}
                value={formatDate(membershipData.result.data.datePensionableServiceStarted)}
              />
            )}
            {membershipData.result?.data?.dateOfLeaving && (
              <ListItem
                id="member-left-plan-date"
                text={labelByKey('membership_data_panel_you_left_plan_date')}
                value={formatDate(membershipData.result.data.dateOfLeaving)}
              />
            )}
            {(!!membershipData.result?.data?.transferInServiceYears ||
              !!membershipData.result?.data?.transferInServiceMonths) && (
              <ListItem
                id="member-transferred-service"
                text={labelByKey('membership_data_panel_transferred_service')}
                value={combineYearsAndMonths(
                  membershipData.result.data.transferInServiceYears || 0,
                  membershipData.result.data.transferInServiceMonths || 0,
                )}
              />
            )}
            {(!!membershipData.result?.data?.totalPensionableServiceYears ||
              !!membershipData.result?.data?.totalPensionableServiceMonths) && (
              <ListItem
                id="member-total-pensionable-service"
                text={labelByKey('membership_data_panel_total_pensionable_service')}
                value={combineYearsAndMonths(
                  membershipData.result.data.totalPensionableServiceYears || 0,
                  membershipData.result.data.totalPensionableServiceMonths || 0,
                )}
              />
            )}
            {!!membershipData.result?.data?.finalPensionableSalary && (
              <Box display="flex" alignItems="center">
                <ListItem
                  id="member-final-pensionable-service"
                  text={
                    <Box display="flex">
                      {labelByKey('membership_data_panel_final_pensionable_service')}
                      <Tooltip header={tooltip?.header} html={tooltip?.html} iconColor="black" />
                    </Box>
                  }
                  value={`${labelByKey('currency:GBP')}${currencyValue(
                    membershipData.result.data.finalPensionableSalary,
                  )}`}
                />
              </Box>
            )}
          </List>
        </Grid>
      </Grid>
    </Box>
  );

  function combineYearsAndMonths(years: number, months: number): string {
    return `${years} ${labelByKey('membership_data_panel_years')} ${months} ${labelByKey(
      'membership_data_panel_months',
    )}`;
  }
};

function ListItem({ text, value, id }: { text: string | React.ReactNode; value: string | number; id: string }) {
  return (
    <MuiListItem sx={{ py: 6, display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }} data-testid={id}>
      <Typography component="strong" fontWeight="bold" mr={2} maxWidth={{ xs: '100px', sm: 'unset' }}>
        {text}
      </Typography>
      <Typography component="span" flex={1} textAlign={{ xs: 'right', sm: 'left' }}>
        {value}
      </Typography>
    </MuiListItem>
  );
}
