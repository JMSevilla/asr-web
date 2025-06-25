import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Button, CheckboxField, DetailsContainer, PrimaryButton, SecondaryButton } from '../..';
import { AccessKey } from '../../../api/mdp/types';
import { findValueByKey } from '../../../business/find-in-array';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useCachedCmsTokens } from '../../../core/contexts/contentData/useCachedCmsTokens';
import { useApiCallback } from '../../../core/hooks/useApi';
import { useCachedAccessKey } from '../../../core/hooks/useCachedAccessKey';
import { useRouter } from '../../../core/router';
import { TransferIFAAcknowledgementsFormType, transferIFAAcknowledgementsSchema } from './validation';

interface Props {
  id?: string;
  parameters: { key: string; value: string }[];
}

export const TransferIFAAcknowledgementsFormBlock: React.FC<Props> = ({ id, parameters }) => {
  const router = useRouter();
  const { labelByKey, htmlByKey, buttonByKey, messageByKey } = useGlobalsContext();
  const nextPageKey = findValueByKey('success_next_page', parameters) ?? '';
  const prevPageKey = findValueByKey('previous_page', parameters) ?? '';
  const sendIfaEmailsCb = useApiCallback((api, p: AccessKey) => api.mdp.sendIfaEmails(p));
  const cmsTokens = useCachedCmsTokens();
  const accessKey = useCachedAccessKey();
  const { control, formState, watch } = useForm<TransferIFAAcknowledgementsFormType>({
    resolver: yupResolver(transferIFAAcknowledgementsSchema),
    mode: 'onChange',
    defaultValues: transferIFAAcknowledgementsSchema.getDefault(),
    criteriaMode: 'all',
  });
  const changeEmailButton = buttonByKey('transfer_IFA_ack_form_email_change_button');
  const changePhoneButton = buttonByKey('transfer_IFA_ack_form_phone_change_button');

  return (
    <Grid id={id} container spacing={8} data-testid="transfer-ifa-referral-ack-block">
      <Grid item xs={12}>
        <DetailsContainer title={labelByKey('transfer_IFA_ack_form_contact_details_header')}>
          <Grid item xs={12} container rowSpacing={4} columnSpacing={8}>
            <Grid item xs={12} md={2}>
              <Typography variant="body1" component="h3" fontWeight="bold">
                {labelByKey('transfer_IFA_ack_form_contact_details_email')}
              </Typography>
            </Grid>
            <Grid item xs={12} flex={{ md: 1 }} display="flex">
              <Typography
                color="primary"
                variant="secondLevelValue"
                component="span"
                display="inline-block"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {cmsTokens.data?.email || labelByKey('lvfas_no_email_no_phone_message_blank')}
              </Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              {changeEmailButton && (
                <Button
                  {...changeEmailButton}
                  data-testid="membership-personal-details-action-btn"
                  onClick={handleChangeEmailClick}
                  loading={router.loading || router.parsing}
                >
                  {changeEmailButton.text}
                </Button>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} container rowSpacing={4} columnSpacing={8}>
            <Grid item xs={12} md={2}>
              <Typography variant="body1" component="h3" fontWeight="bold">
                {labelByKey('transfer_IFA_ack_form_contact_details_phone')}
              </Typography>
            </Grid>
            <Grid item xs={12} flex={{ md: 1 }} display="flex">
              <Typography
                color="primary"
                variant="secondLevelValue"
                component="span"
                display="inline-block"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {cmsTokens.data?.phoneNumber
                  ? `+${cmsTokens.data?.phoneNumber}`
                  : labelByKey('lvfas_no_email_no_phone_message_blank')}
              </Typography>
            </Grid>
            <Grid item xs={12} md="auto">
              {changePhoneButton && (
                <Button
                  {...changePhoneButton}
                  data-testid="membership-personal-details-action-btn"
                  onClick={handleChangePhoneClick}
                  loading={router.loading || router.parsing}
                  type={changePhoneButton.type}
                  notification={changePhoneButton.notification}
                >
                  {changePhoneButton.text}
                </Button>
              )}
            </Grid>
          </Grid>
        </DetailsContainer>
      </Grid>
      {(!cmsTokens.data?.email || !cmsTokens.data?.phoneNumber) && (
        <Grid item xs={12}>
          {messageByKey(problemMessageKey())}
        </Grid>
      )}
      <Grid item xs={12}>
        <CheckboxField
          control={control}
          name="option1"
          disabled={formState.isSubmitting}
          label={htmlByKey('transfer_IFA_ack_acknowledgements_option_1')}
        />
      </Grid>
      <Grid item xs={12} container spacing={4}>
        <Grid item>
          <PrimaryButton
            disabled={!watch('option1') || !cmsTokens.data?.email || !cmsTokens.data?.phoneNumber}
            loading={router.loading || router.parsing || sendIfaEmailsCb.loading || accessKey.loading}
            onClick={handleSend}
          >
            {labelByKey('transfer_IFA_ack_send')}
          </PrimaryButton>
        </Grid>
        <Grid item>
          <SecondaryButton loading={router.loading || router.parsing || sendIfaEmailsCb.loading} onClick={handleCancel}>
            {labelByKey('transfer_IFA_ack_return')}
          </SecondaryButton>
        </Grid>
      </Grid>
    </Grid>
  );

  async function handleChangeEmailClick() {
    changeEmailButton?.linkKey && (await router.parseUrlAndPush(changeEmailButton.linkKey));
  }

  async function handleChangePhoneClick() {
    changePhoneButton?.linkKey && (await router.parseUrlAndPush(changePhoneButton.linkKey));
  }

  async function handleSend() {
    if (!accessKey.data?.contentAccessKey) return;

    try {
      await sendIfaEmailsCb.execute({ contentAccessKey: accessKey.data.contentAccessKey });
      await accessKey.refresh();
    } catch {
      return;
    }

    await router.parseUrlAndPush(nextPageKey);
  }

  async function handleCancel() {
    await router.parseUrlAndPush(prevPageKey);
  }

  function problemMessageKey() {
    if (!cmsTokens.data?.email && !cmsTokens.data?.phoneNumber) {
      return 'lvfas_no_email_no_phone_message';
    }
    if (!cmsTokens.data?.email) {
      return 'lvfas_no_email_message';
    }
    if (!cmsTokens.data?.phoneNumber) {
      return 'lvfas_no_phone_message';
    }
    return '';
  }
};
