import { Box, Grid, List, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { ListLoader } from '../..';
import { formatUserAddress } from '../../../business/address';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useApi } from '../../../core/hooks/useApi';
import { MessageType } from '../../topAlertMessages';
import { MemberListItem } from './MemberListItem';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
}

export const MemberContactsBlock: React.FC<Props> = ({ id, parameters }) => {
  const changeEmailPageKey = findValueByKey('change_email_page_key', parameters) ?? '';
  const changePhonePageKey = findValueByKey('change_phone_page_key', parameters) ?? '';
  const changeAddressPageKey = findValueByKey('change_address_page_key', parameters) ?? '';
  const emailResult = useApi(api => api.mdp.userEmail());
  const phoneResult = useApi(api => api.mdp.userPhone());
  const addressResult = useApi(api => api.mdp.userAddress());
  const { labelByKey } = useGlobalsContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const { errorByKey } = useGlobalsContext();

  const urls = useApi(api =>
    Promise.all([
      api.content.urlFromKey(changeEmailPageKey),
      api.content.urlFromKey(changePhonePageKey),
      api.content.urlFromKey(changeAddressPageKey),
    ]),
  );

  const [emailKeyUrl, phoneKeyUrl, AddressKeyUrl] = urls?.result ?? [null, null, null];

  useEffect(() => {
    const errors = urls.error as string[] | undefined;

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [urls.error]);

  if (emailResult.loading || phoneResult.loading || addressResult.loading) {
    return <ListLoader id={id} loadersCount={3} />;
  }

  return (
    <Box id={id} mb={8}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h3" fontWeight="bold">
            {labelByKey('my_details_contact_info')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <List>
            <MemberListItem
              data-testid="my_details_email"
              text={labelByKey('my_details_email')}
              buttonAria={labelByKey('my_details_email_edit_aria')}
              value={
                emailResult?.result?.data?.email
                  ? `${emailResult.result.data.email}`
                  : labelByKey('personal_details_not_available')
              }
              url={emailKeyUrl?.data?.url}
            />
            <MemberListItem
              data-testid="my_details_phone"
              text={labelByKey('my_details_phone')}
              buttonAria={labelByKey('my_details_phone_edit_aria')}
              value={
                phoneResult?.result?.data?.number && phoneResult?.result?.data?.code
                  ? `+${phoneResult.result.data.code} ${phoneResult.result.data.number}`
                  : labelByKey('personal_details_not_available')
              }
              url={phoneKeyUrl?.data?.url}
            />
            <MemberListItem
              data-testid="my_details_address"
              text={labelByKey('my_details_address')}
              buttonAria={labelByKey('my_details_address_edit_aria')}
              value={isExistUserAddress()}
              url={AddressKeyUrl?.data?.url}
            />
          </List>
        </Grid>
      </Grid>
    </Box>
  );

  function isExistUserAddress() {
    const address = addressResult?.result?.data;

    if (!address) return labelByKey('personal_details_not_available');

    return formatUserAddress(address, ', ');
  }
};
