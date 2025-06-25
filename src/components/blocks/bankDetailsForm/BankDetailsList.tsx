import { Divider, Grid, List, ListItem as MuiListItem, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { PrimaryButton } from '../..';
import { UserValidatedDetails } from '../../../api/mdp/types';
import { DEFAULT_PHONE_COUNTRY_CODE, NA_SYMBOL } from '../../../business/constants';
import { isIbanMandatoryByCountryCode } from '../../../business/country';
import { currencyCodeToName } from '../../../business/currency';
import { useGlobalsContext } from '../../../core/contexts/GlobalsContext';
import { useJourneyIndicatorContext } from '../../../core/contexts/JourneyIndicatorContext';
import { CheckedMark } from '../../icons';
import { BankDetailsFormType } from './validation';

interface Props {
  id?: string;
  details: BankDetailsFormType;
  bankDetails?: UserValidatedDetails;
  submitLoading: boolean;
  onContinue: () => void;
  onBackClick: () => void;
}

export const BankDetailsList: React.FC<Props> = ({
  id,
  details,
  bankDetails,
  submitLoading,
  onContinue,
  onBackClick,
}) => {
  const isUk = details?.bankCountryCode === DEFAULT_PHONE_COUNTRY_CODE;
  const isIbanMandatory = useMemo(
    () => isIbanMandatoryByCountryCode(details?.bankCountryCode),
    [details?.bankCountryCode],
  );
  const { labelByKey, htmlByKey } = useGlobalsContext();
  const { setCustomHeader } = useJourneyIndicatorContext();

  useEffect(() => {
    setCustomHeader({
      title: labelByKey('bank_details_confirmation_header'),
      action: onBackClick,
      icon: CheckedMark as React.FC,
    });
  }, []);

  return (
    <Grid id={id} container gap={12}>
      <Grid item xs={12} container>
        <Grid item xs={12}>
          <List data-testid="bank_details_list">
            <ListItem text={labelByKey('bank_details_confirmation_bank_account_name')} value={details.accountName} />
            {details?.accountCurrency && !isUk && (
              <ListItem
                text={labelByKey('bank_bank_account_currency')}
                value={currencyCodeToName(details.accountCurrency)}
              />
            )}
            {details?.accountNumber && !isIbanMandatory && (
              <ListItem text={labelByKey('bank_details_confirmation_account_number')} value={details.accountNumber} />
            )}
            {details?.sortCode && isUk && (
              <ListItem
                text={labelByKey('bank_details_confirmation_bank_sort_code')}
                value={details.sortCode?.replace(/.{2}\B/g, '$&-')}
              />
            )}
            {details?.iban && isIbanMandatory && (
              <ListItem text={labelByKey('bank_details_confirmation_bank_iban')} value={details.iban} />
            )}
            {details?.clearingCode && !isUk && !isIbanMandatory && (
              <ListItem
                text={labelByKey('bank_details_confirmation_bank_clearing_code')}
                value={details?.clearingCode}
              />
            )}
            {details?.bic && !isUk && (
              <ListItem text={labelByKey('bank_details_confirmation_bank_bic')} value={details.bic} />
            )}
            <ListItem
              text={labelByKey('bank_details_confirmation_bank_name')}
              value={bankDetails?.bankName || NA_SYMBOL}
            />
            <ListItem
              text={labelByKey('bank_details_confirmation_bank_branch')}
              value={bankDetails?.branchName || NA_SYMBOL}
            />
            <ListItem
              text={labelByKey('bank_details_confirmation_bank_street')}
              value={bankDetails?.streetAddress || NA_SYMBOL}
            />
            <ListItem text={labelByKey('bank_details_confirmation_bank_city')} value={bankDetails?.city || NA_SYMBOL} />
            <ListItem
              text={labelByKey('bank_details_confirmation_bank_clearing_country')}
              value={bankDetails?.country || NA_SYMBOL}
            />
            <ListItem
              text={labelByKey('bank_details_confirmation_bank_post_code')}
              value={bankDetails?.postCode || NA_SYMBOL}
            />
          </List>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1" component="div">
          {htmlByKey(`bank_details_confirmation_description`)}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography
          variant="body1"
          component="a"
          onClick={onBackClick}
          onKeyDown={(e: React.KeyboardEvent) => e.code === 'Enter' && onBackClick()}
          sx={{ '&:hover': { cursor: 'pointer' }, textDecoration: 'underline' }}
        >
          {labelByKey('bank_form_confirmation_change_details')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <PrimaryButton onClick={onContinue} loading={submitLoading} data-testid="bank-details-continue">
          {labelByKey('continue')}
        </PrimaryButton>
      </Grid>
    </Grid>
  );
};

function ListItem({ text, value }: { text: string; value: string }) {
  return (
    <>
      <MuiListItem sx={{ py: 6 }}>
        <Typography fontWeight="bold" mr={2}>
          {text}
        </Typography>
        <Typography>{value}</Typography>
      </MuiListItem>
      <Divider />
    </>
  );
}
