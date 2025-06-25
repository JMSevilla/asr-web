import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { ListLoader } from '../../';
import { JourneyTypeSelection } from '../../../api/content/types/page';
import { SearchAddressParams, UserAddress } from '../../../api/mdp/types';
import { COUNTRY_LIST } from '../../../business/constants';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useNotificationsContext } from '../../../core/contexts/NotificationsContext';
import { useContentDataContext } from '../../../core/contexts/contentData/ContentDataContext';
import { usePersistentAppState } from '../../../core/contexts/persistentAppState/PersistentAppStateContext';
import { useApi, useApiCallback } from '../../../core/hooks/useApi';
import { useSubmitJourneyStep } from '../../../core/hooks/useSubmitJourneyStep';
import { trackButtonClick } from '../../../core/matomo-analytics';
import { mixpanelTrackButtonClick } from '../../../core/mixpanel-tracker';
import { useRouter } from '../../../core/router';
import { MessageType } from '../../topAlertMessages';
import { AddressForm } from './AddressForm';
import { AddressFormType } from './validation';

interface Props {
  id?: string;
  pageKey: string;
  journeyType?: JourneyTypeSelection;
  parameters: { key: string; value: string }[];
  isStandAlone?: boolean;
}

export const AddressBlock: React.FC<Props> = ({ id, pageKey, journeyType, parameters, isStandAlone }) => {
  const router = useRouter();
  const { fastForward } = usePersistentAppState();
  const { errorByKey } = useGlobalsContext();
  const { updateCmsToken } = useContentDataContext();
  const { showNotifications, hideNotifications } = useNotificationsContext();
  const isCloseButtonHidden = !!findValueByKey('hide_save_and_close', parameters);
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const closeNextPageKey = findValueByKey('close_next_page', parameters) ?? '';
  const saveAndExitButtonKey = findValueByKey('save_and_exit_button', parameters);
  const addressDetailsCb = useApiCallback((api, id: string) => api.mdp.addressDetails(id));
  const addressSummaryCb = useApiCallback((api, params: SearchAddressParams) => api.mdp.addressSummary(params));
  const submitJourneyStepCb = useSubmitJourneyStep(journeyType);
  const userAddress = useApi(api => api.mdp.userAddress());
  const updateUserAddress = useApiCallback(async (api, args: UserAddress) => {
    const result = await api.mdp.updateUserAddress(args);
    updateCmsToken('address', args);
    return result;
  });

  useEffect(() => {
    const errors = updateUserAddress.error as string[] | undefined;

    if (errors) {
      showNotifications(
        errors.map(error => ({
          type: MessageType.Problem,
          title: errorByKey('address_form_error'),
          message: errorByKey(error),
        })),
      );
    }
    return () => hideNotifications();
  }, [updateUserAddress.error, showNotifications, errorByKey, hideNotifications]);

  if (userAddress.loading) {
    return <ListLoader id={id} loadersCount={4} />;
  }

  return (
    <Grid id={id} container spacing={12}>
      <Grid item xs={12}>
        <AddressForm
          isStandAlone={isStandAlone}
          submitLoading={updateUserAddress.loading || submitJourneyStepCb.loading || router.loading || router.parsing}
          initialData={mapInitialAddress(userAddress.result?.data)}
          isCloseButtonHidden={isCloseButtonHidden}
          isLoading={userAddress.loading}
          onSubmit={handleSubmit}
          onClosed={handleClose}
          onAddressDetailsLookup={handleAddressDetailsLookup}
          onAddressSummaryLookup={handleAddressSummaryLookup}
          saveAndExitButtonKey={saveAndExitButtonKey}
        />
      </Grid>
    </Grid>
  );

  async function handleAddressDetailsLookup(addressId: string) {
    const result = await addressDetailsCb.execute(addressId);
    return result?.data;
  }

  async function handleAddressSummaryLookup(params: SearchAddressParams) {
    const result = await addressSummaryCb.execute(params);
    return result?.data;
  }

  async function handleSubmit(address: AddressFormType) {
    if (!nextPageKey) {
      return;
    }

    const mappedAddress = mapUserAddress(address);
    await updateUserAddress.execute(mappedAddress);

    mixpanelTrackButtonClick({
      Category: 'address updated',
    });
    trackButtonClick('address updated');
    const query = isStandAlone ? { message: 'address_updated' } : {};

    if (journeyType) {
      await submitJourneyStepCb.execute({ currentPageKey: pageKey, nextPageKey });
    }

    let redirectPage = nextPageKey;
    if (journeyType && fastForward.shouldGoToSummary(journeyType, nextPageKey)) {
      redirectPage = fastForward.state[journeyType].summaryPageKey!;
      fastForward.reset(journeyType);
    }

    await router.parseUrlAndPush({ key: redirectPage, query });
  }

  async function handleClose() {
    await router.parseUrlAndPush(closeNextPageKey);
  }
};

function mapInitialAddress(data?: UserAddress): Partial<AddressFormType> {
  const values: Partial<AddressFormType> = {};
  data?.streetAddress1 && Object.assign(values, { addressLine1: data.streetAddress1 });
  data?.streetAddress2 && Object.assign(values, { addressLine2: data.streetAddress2 });
  data?.streetAddress3 && Object.assign(values, { addressLine3: data.streetAddress3 });
  data?.streetAddress4 && Object.assign(values, { addressLine4: data.streetAddress4 });
  data?.streetAddress5 && Object.assign(values, { addressLine5: data.streetAddress5 });
  data?.postCode && Object.assign(values, { postCode: data.postCode });
  data?.countryCode && Object.assign(values, { countryCode: data.countryCode });

  return values;
}

function mapUserAddress(data: AddressFormType): UserAddress {
  return {
    streetAddress1: data.addressLine1,
    streetAddress2: data.addressLine2,
    streetAddress3: data.addressLine3,
    streetAddress4: data.addressLine4,
    streetAddress5: data.addressLine5,
    postCode: data.postCode,
    countryCode: data.countryCode,
    country: COUNTRY_LIST.find(country => data.countryCode === country.countryCode)?.countryName,
  };
}
