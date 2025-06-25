import { KeyboardArrowDown } from '@mui/icons-material';
import { Grid, MenuItem, Select, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FieldError, InputLoader } from '..';
import { countryByCode } from '../../business/country';
import { CmsTooltip } from '../../cms/types';
import { useAuthContext } from '../../core/contexts/auth/AuthContext';
import { useApi } from '../../core/hooks/useApi';
import { Tooltip } from '../Tooltip';

interface Props<T extends object> {
  name: Path<T>;
  control: Control<T, object>;
  tooltip?: CmsTooltip;
  isLoading?: boolean;
  label?: string | JSX.Element;
  optional?: boolean;
  displayEmpty?: boolean;
}

export const CountrySelectField = <T extends FieldValues>({
  name,
  control,
  tooltip,
  isLoading,
  label,
  optional,
  displayEmpty,
}: Props<T>) => {
  const { isAuthenticated } = useAuthContext();
  const codeFromForm = control._getWatch(name);
  const [code, setCode] = useState<string>(codeFromForm);
  const countries = useApi(api => (isAuthenticated ? api.mdp.countryList() : api.mdp.bereavementCountryList()));

  const countryList = useMemo(
    () => [
      ...(countries?.result?.data.map(country => ({
        countryCode: country.countryCode || country.code,
        countryName: country.countryName || country.name,
      })) || []),
    ],
    [countries.result?.data],
  );

  useEffect(() => {
    codeFromForm !== code && setCode(control._getWatch(name));
  }, [codeFromForm]);

  if (isLoading) {
    return <InputLoader />;
  }

  const country = countryByCode(code);

  return (
    <Grid container spacing={2}>
      <Controller
        name={name}
        control={control}
        render={({ field: { name, onChange, value, ref }, fieldState: { error } }) => (
          <Grid item xs={12} container wrap="nowrap">
            <Grid item container direction="column">
              {label && (
                <Grid item>
                  {error?.message ? (
                    <FieldError messageKey={error.message} />
                  ) : (
                    <Typography component="label" htmlFor={name}>
                      {label ?? '[[label_name]]'}
                    </Typography>
                  )}
                </Grid>
              )}
              <Grid item container flexWrap="nowrap">
                <Grid item flex={1}>
                  <Select
                    key={code}
                    fullWidth
                    id={name}
                    inputRef={ref}
                    data-testid={name}
                    inputProps={{ shrink: 'false' }}
                    color="primary"
                    IconComponent={KeyboardArrowDown}
                    onChange={e => {
                      onChange(e.target.value);
                      setCode(e.target.value);
                    }}
                    value={code}
                    defaultValue={code}
                    displayEmpty={displayEmpty}
                  >
                    {optional && (
                      <MenuItem value="">
                        <Typography sx={{ height: '26px' }} />
                      </MenuItem>
                    )}
                    {countryList.map(country => (
                      <MenuItem
                        key={country.countryCode}
                        value={country.countryCode}
                        id={country.countryCode}
                        data-testid={country.countryCode}
                      >
                        {country.countryName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                {country && (
                  <Grid item display="flex" justifyContent="center" alignItems="center" pl={4}>
                    <ReactCountryFlag
                      countryCode={value}
                      svg
                      style={{
                        width: '2em',
                        height: '2em',
                      }}
                      title={country}
                      alt={`${country} flag`}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        )}
      ></Controller>

      {tooltip && (
        <Grid item xs={12} data-mdp-key="bank_country_tooltip">
          <Tooltip header={tooltip?.header} html={tooltip?.html} underlinedText>
            {tooltip?.text ?? '[[bank_country_tooltip]]'}
          </Tooltip>
        </Grid>
      )}
    </Grid>
  );
};
