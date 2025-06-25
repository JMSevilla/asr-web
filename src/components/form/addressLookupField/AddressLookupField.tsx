import { Grid, Typography } from '@mui/material';
import { Address, AddressSummary, SearchAddressParams } from '../../../api/mdp/types';
import { AddressSearch } from './AddressSearch';

interface Props {
  id: string;
  label: string;
  placeholder?: string;
  country?: string | null;
  onAddressChanged(data: Address): void;
  onAddressDetailsLookup(addressId: string): Promise<Address[]>;
  onAddressSummaryLookup(params: SearchAddressParams): Promise<AddressSummary[]>;
}

export const AddressLookupField: React.FC<Props> = ({
  id,
  label,
  placeholder,
  country,
  onAddressChanged,
  onAddressDetailsLookup,
  onAddressSummaryLookup,
}) => {
  return (
    <Grid item container spacing={2}>
      <Grid item xs={12}>
        <Typography component="label" htmlFor={id}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AddressSearch
          id={id}
          inline
          locale="en_GB"
          country={country}
          onSelect={onAddressChanged}
          onAddressDetailsLookup={onAddressDetailsLookup}
          onAddressSummaryLookup={onAddressSummaryLookup}
          placeholder={placeholder}
        />
      </Grid>
    </Grid>
  );
};
