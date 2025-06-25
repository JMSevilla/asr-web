import { Box, Grid, List, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { ListLoader } from '../..';
import { NA_SYMBOL } from '../../../business/constants';
import { formatDate, isoTimeToText, timelessDateString } from '../../../business/dates';
import { findValueByKey } from '../../../business/find-in-array';
import { openInNewTab } from '../../../business/navigation';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useRouter } from '../../../core/router';
import { Button } from '../../buttons';
import { MessageType } from '../../topAlertMessages';
import { MemberListItem } from './MemberListItem';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
}

export const MemberPersonalDetailsBlock: React.FC<Props> = ({ id, parameters }) => {
  const showNormalRetirementDate = findValueByKey('normal_retirement_date', parameters) ?? '';
  const showNormalRetirementAge = findValueByKey('normal_retirement_age', parameters) ?? '';
  const { labelByKey, buttonByKey, errorByKey, globals } = useGlobalsContext();
  const router = useRouter();
  const membershipData = useApi(api => api.mdp.membershipData());
  const parseUrlCb = useApiCallback((api, key: string) => api.content.urlFromKey(key));
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const cmsTokens = useCachedCmsTokens();
  const ageAtNormalRetirement =
    (cmsTokens.data?.ageAtNormalRetirementIso && isoTimeToText(globals, cmsTokens.data?.ageAtNormalRetirementIso, 2)) ??
    NA_SYMBOL;

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

  if (membershipData.loading || cmsTokens.loading) {
    return <ListLoader id={id} loadersCount={3} />;
  }

  const button = buttonByKey('personal_details_change_button');

  return (
    <Box id={id} mb={12} data-testid="membership-details-block">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontWeight="bold">
            {labelByKey('my_details_personal')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List>
            <MemberListItem
              data-testid="my_details_member_name"
              text={labelByKey('my_details_member_name')}
              value={`${membershipData?.result?.data?.title ?? ''} ${membershipData.result?.data?.forenames ?? ''} ${
                membershipData.result?.data?.surname ?? ''
              }`}
            />
            <MemberListItem
              data-testid="my_details_member_dob"
              text={labelByKey('my_details_member_dob')}
              value={
                membershipData?.result?.data?.dateOfBirth
                  ? formatDate(timelessDateString(membershipData.result.data.dateOfBirth))
                  : ''
              }
            />
            <MemberListItem
              data-testid="my_details_member_ni"
              text={labelByKey('my_details_member_ni')}
              value={membershipData?.result?.data?.insuranceNumber ?? ''}
            />
            {showNormalRetirementDate && (
              <MemberListItem
                data-testid="my_personal_details_panel_nrd"
                text={labelByKey('my_personal_details_panel_nrd')}
                value={
                  membershipData?.result?.data?.normalRetirementDate
                    ? formatDate(membershipData.result.data.normalRetirementDate)
                    : ''
                }
              />
            )}
            {showNormalRetirementAge && (
              <MemberListItem
                data-testid="my_personal_details_panel_nra"
                text={labelByKey('my_personal_details_panel_nra')}
                value={ageAtNormalRetirement}
              />
            )}
          </List>
        </Grid>
        {button && (
          <Grid item xs={12}>
            <Button
              {...button}
              data-testid="membership-personal-details-action-btn"
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
