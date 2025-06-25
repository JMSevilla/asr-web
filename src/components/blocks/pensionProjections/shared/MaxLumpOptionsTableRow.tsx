import { CircularProgress, TableCell, TableRow, Theme } from '@mui/material';
import { SxProps } from '@mui/system';
import { currencyValue } from '../../../../business/currency';
import { useGlobalsContext } from '../../../../core/contexts/GlobalsContext';
import { useApi } from '../../../../core/hooks/useApi';

interface Props {
  age: number;
  isNormalRetirementAge: (age: number) => boolean;
  index: number;
  sx?: SxProps<Theme>;
}

const tableCellSx: SxProps<Theme> = {
  typography: { xs: 'body2', md: 'body1' },
  overflow: 'hidden',
};

export const MaxLumpOptionsTableRow: React.FC<Props> = ({ age, isNormalRetirementAge, index, sx }) => {
  const { result, loading } = useApi(api => api.mdp.retirementOptions(age));
  const { labelByKey } = useGlobalsContext();
  const calculationSuccessful = result?.data?.isCalculationSuccessful ?? false;

  const cellSx: SxProps<Theme> = { ...tableCellSx, ...sx };

  return loading ? (
    <TableRow>
      <TableCell sx={cellSx} align="left" data-testid={`pension-option-row-${index}-age`}>
        {`${age}${isNormalRetirementAge(age) ? '*' : ''}`}
      </TableCell>
      <TableCell sx={cellSx} align={'right'} data-testid={`pension-option-row-${index}-max-lump-sum`}>
        <CircularProgress size={24} />
      </TableCell>
      <TableCell sx={cellSx} align={'right'} data-testid={`pension-option-row-${index}-max-lump-sum-yearly`}>
        <CircularProgress size={24} />
      </TableCell>
    </TableRow>
  ) : calculationSuccessful ? (
    <TableRow>
      <TableCell sx={cellSx} align="left" data-testid={`pension-option-row-${index}-age`}>
        {`${age}${isNormalRetirementAge(age) ? '*' : ''}`}
      </TableCell>
      <TableCell sx={cellSx} align={'right'} data-testid={`pension-option-row-${index}-max-lump-sum`}>
        {calculationSuccessful && `${labelByKey('currency:GBP')}${currencyValue(result?.data?.maxLumpSum)}`}
      </TableCell>
      <TableCell sx={cellSx} align={'right'} data-testid={`pension-option-row-${index}-max-lump-sum-yearly`}>
        {`${labelByKey('currency:GBP')}${currencyValue(result?.data?.maxLumpSumYearlyIncome)}`}
      </TableCell>
    </TableRow>
  ) : null;
};
